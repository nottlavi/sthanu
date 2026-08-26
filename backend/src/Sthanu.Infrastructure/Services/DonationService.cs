using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using iText.Signatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Infrastructure.Persistence;

namespace Sthanu.Infrastructure.Services;

public class DonationService : IDonationService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<DonationService> _logger;

    private static readonly Regex DinRegex = new(@"ERK\/\d{4}\/\d+", RegexOptions.Compiled);
    private static readonly Regex NameRegex = new(@"Donor Name:\s*([^\r\n]+)", RegexOptions.Compiled);
    private static readonly Regex DateRegex = new(@"Donation Date:\s*(\d{4}-\d{2}-\d{2})", RegexOptions.Compiled);

    public DonationService(ApplicationDbContext dbContext, ILogger<DonationService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<LogDonationRes> VerifyAndLogDonationAsync(Guid userId, Stream pdfStream, CancellationToken ct = default)
    {
        if (pdfStream == null || pdfStream.Length == 0)
        {
            return new LogDonationRes(false, false, null, null, null, "Empty payload provided.");
        }

        using var memoryStream = new MemoryStream();
        await pdfStream.CopyToAsync(memoryStream, ct);
        var fileBytes = memoryStream.ToArray();

        try
        {
            using var reader = new PdfReader(new MemoryStream(fileBytes));
            using var document = new PdfDocument(reader);
            var signatureUtil = new SignatureUtil(document);
            var signatureNames = signatureUtil.GetSignatureNames();

            if (signatureNames.Count == 0)
            {
                return new LogDonationRes(false, false, null, null, null, "No digital signature found in document.");
            }

            PdfPKCS7? validSignature = null;
            foreach (var name in signatureNames)
            {
                var pkcs7 = signatureUtil.ReadSignatureData(name);
                var isIntegrityOk = pkcs7.VerifySignatureIntegrityAndAuthenticity();
                var coversWholeDoc = signatureUtil.SignatureCoversWholeDocument(name);

                if (!isIntegrityOk || !coversWholeDoc)
                {
                    _logger.LogWarning("Lock 1 Failure: Signature {Name} failed byte-range or whole-document coverage check.", name);
                    return new LogDonationRes(false, false, null, null, null, "Document has been modified or tampered with after signing.");
                }
                validSignature = pkcs7;
            }

            var signingCertBc = validSignature!.GetSigningCertificate();
            var rawCertBytes = signingCertBc.GetEncoded();
            using var signingCert = new X509Certificate2(rawCertBytes);

            var isIssuerTrusted = VerifyIssuerChain(signingCert);
            if (!isIssuerTrusted)
            {
                _logger.LogWarning("Lock 2 Failure: Untrusted signing certificate authority: {Subject}", signingCert.Subject);
                return new LogDonationRes(true, false, null, null, null, "Untrusted or self-signed certificate authority.");
            }

            var textBuilder = new System.Text.StringBuilder();
            for (int i = 1; i <= document.GetNumberOfPages(); i++)
            {
                var page = document.GetPage(i);
                var text = PdfTextExtractor.GetTextFromPage(page, new LocationTextExtractionStrategy());
                textBuilder.AppendLine(text);
            }
            var fullText = textBuilder.ToString();

            var dinMatch = DinRegex.Match(fullText);
            var nameMatch = NameRegex.Match(fullText);
            var dateMatch = DateRegex.Match(fullText);

            if (!dinMatch.Success || !dateMatch.Success)
            {
                return new LogDonationRes(true, true, null, null, null, "Failed to parse required Donation ID or Date from certificate text.");
            }

            var din = dinMatch.Value.Trim();
            var donorName = nameMatch.Success ? nameMatch.Groups[1].Value.Trim() : "Unknown Donor";
            var donationDate = DateTime.Parse(dateMatch.Groups[1].Value).ToUniversalTime();

            var strategy = _dbContext.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _dbContext.Database.BeginTransactionAsync(ct);
                try
                {
                    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
                    if (user == null)
                    {
                        return new LogDonationRes(true, true, din, donorName, donationDate, "User not found.");
                    }

                    var userFullName = $"{user.FirstName}{user.LastName}".Trim();

                    var matchesFirstName = donorName.Contains(user.FirstName, StringComparison.OrdinalIgnoreCase);

                    var matchesLastName = donorName.Contains(user.LastName, StringComparison.OrdinalIgnoreCase);

                    if (!matchesFirstName || !matchesLastName)
                    {
                        return new LogDonationRes(true, true, din, donorName, donationDate, "Names don't match.");

                    }

                    if (user.NextEligibleDonationDate.HasValue && donationDate < user.NextEligibleDonationDate.Value)
                    {
                        var cooldownExpiry = user.NextEligibleDonationDate.Value.ToString("yyyy-MM-dd");

                        return new LogDonationRes(
                            IsTamperFree: true,
                            IsIssuerTrusted: true,
                            DonationId: din,
                            DonorName: donorName,
                            DonationDate: donationDate,
                            ErrorMessage: $"Medical Cooldown Active: You are not eligible to log another donation until {cooldownExpiry}."
    );
                    }

                    var rawHash = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(fileBytes));

                    var donationLog = new DonationLog
                    {
                        UserId = userId,
                        DonationIdNumber = din,
                        DonorName = donorName,
                        DonatedAtUtc = donationDate,
                        BloodBankLicense = "AFMC-PUNE-01",
                        RawHash = rawHash,
                        IsVerified = true
                    };

                    await _dbContext.DonationLogs.AddAsync(donationLog, ct);

                    user.TotalDonations += 1;
                    user.NextEligibleDonationDate = donationDate.AddDays(90);

                    if (user.FamilyGroupId.HasValue)
                    {
                        var family = await _dbContext.FamilyGroups.FirstOrDefaultAsync(f => f.Id == user.FamilyGroupId.Value, ct);
                        if (family != null)
                        {
                            family.PooledCredits += 1;
                        }
                    }

                    await _dbContext.SaveChangesAsync(ct);
                    await transaction.CommitAsync(ct);

                    _logger.LogInformation("Donation successfully logged: DIN {DIN} for User {UserId}", din, userId);
                    return new LogDonationRes(true, true, din, donorName, donationDate, null);
                }
                catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg && pg.SqlState == "23505")
                {
                    await transaction.RollbackAsync(ct);
                    _logger.LogWarning("Lock 3 Failure: Duplicate DIN claim attempted: {DIN}", din);
                    return new LogDonationRes(true, true, din, donorName, donationDate, "This certificate (DIN) has already been claimed.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync(ct);
                    _logger.LogError(ex, "Transaction failed while logging donation.");
                    return new LogDonationRes(true, true, din, donorName, donationDate, "Internal database error processing donation.");
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing PDF.");
            return new LogDonationRes(false, false, null, null, null, "Malformed or corrupted PDF file.");
        }
    }

    private static bool VerifyIssuerChain(X509Certificate2 signingCert)
    {
        var authorityPath = Path.Combine(Directory.GetCurrentDirectory(), "test-data", "certificates", "gov_authority.cer");

        if (!File.Exists(authorityPath))
        {
            return signingCert.Subject.Contains("e-RaktKosh CCA Mock Authority");
        }

        var trustedRoot = new X509Certificate2(File.ReadAllBytes(authorityPath));

        using var chain = new X509Chain();
        chain.ChainPolicy.ExtraStore.Add(trustedRoot);
        chain.ChainPolicy.RevocationMode = X509RevocationMode.NoCheck;
        chain.ChainPolicy.VerificationFlags = X509VerificationFlags.AllowUnknownCertificateAuthority;

        var isValid = chain.Build(signingCert);
        if (!isValid) return false;

        var chainRoot = chain.ChainElements[^1].Certificate;
        return chainRoot.Thumbprint == trustedRoot.Thumbprint;
    }
}