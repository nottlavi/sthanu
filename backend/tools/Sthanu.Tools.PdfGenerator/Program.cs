using System.IO;
using iText.Bouncycastle.Crypto;
using iText.Bouncycastle.X509;
using iText.Kernel.Crypto;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Signatures;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Operators;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.X509;

namespace Sthanu.Tools.PdfGenerator;

public class Program
{
    private static readonly string OutputDir = Path.Combine(Directory.GetCurrentDirectory(), "test-data", "certificates");

    public static void Main(string[] args)
    {
        Console.WriteLine("[Sthanu Generator] Generating test suite certificates...");
        Directory.CreateDirectory(OutputDir);

        var (govKey, govCert) = CreateCertificateAuthority("e-RaktKosh CCA Mock Authority");
        var (fakeKey, fakeCert) = CreateCertificateAuthority("Untrusted Mock Authority");

        File.WriteAllBytes(Path.Combine(OutputDir, "gov_authority.cer"), govCert.GetEncoded());

        GenerateSignedPdf("valid_cert_1.pdf", "ERK/2026/100001", "Lavi Arora63", DateTime.UtcNow.AddDays(-2), govKey, govCert);
        GenerateSignedPdf("valid_cert_2.pdf", "ERK/2026/100002", "Lavi Arora64", DateTime.UtcNow.AddDays(-5), govKey, govCert);
        GenerateSignedPdf("valid_cert_3.pdf", "ERK/2026/100003", "Vikram Deshmukh", DateTime.UtcNow.AddDays(-10), govKey, govCert);
        GenerateSignedPdf("valid_cert_4.pdf", "ERK/2026/100004", "Ananya Joshi", DateTime.UtcNow.AddDays(-1), govKey, govCert);

        GenerateSignedPdf("untrusted_signer.pdf", "ERK/2026/200001", "Malicious User", DateTime.UtcNow.AddDays(-1), fakeKey, fakeCert);

        GenerateTamperedPdf("tampered_signature.pdf", "ERK/2026/300001", "Pooja Patil", DateTime.UtcNow.AddDays(-1), govKey, govCert);

        Console.WriteLine($"[Sthanu Generator] Success: Certificates saved to: {OutputDir}");
    }

    private static (AsymmetricKeyParameter Key, X509Certificate Cert) CreateCertificateAuthority(string commonName)
    {
        var keyGen = new RsaKeyPairGenerator();
        keyGen.Init(new KeyGenerationParameters(new SecureRandom(), 2048));
        var keyPair = keyGen.GenerateKeyPair();

        var certGen = new X509V3CertificateGenerator();
        certGen.SetSerialNumber(BigInteger.ValueOf(DateTime.UtcNow.Ticks));
        certGen.SetIssuerDN(new X509Name($"CN={commonName}, O=Government of India, C=IN"));
        certGen.SetSubjectDN(new X509Name($"CN={commonName}, O=Government of India, C=IN"));
        certGen.SetNotBefore(DateTime.UtcNow.AddDays(-1));
        certGen.SetNotAfter(DateTime.UtcNow.AddYears(5));
        certGen.SetPublicKey(keyPair.Public);

        var signer = new Asn1SignatureFactory("SHA256WITHRSA", keyPair.Private);
        var cert = certGen.Generate(signer);

        return (keyPair.Private, cert);
    }

    private static void GenerateSignedPdf(string filename, string din, string donorName, DateTime donationDate, AsymmetricKeyParameter key, X509Certificate cert)
    {
        var tempPath = Path.Combine(OutputDir, "temp_" + filename);
        var finalPath = Path.Combine(OutputDir, filename);

        using (var writer = new PdfWriter(tempPath))
        using (var pdf = new PdfDocument(writer))
        using (var doc = new Document(pdf))
        {
            doc.Add(new Paragraph("GOVERNMENT OF INDIA - MINISTRY OF HEALTH & FAMILY WELFARE"));
            doc.Add(new Paragraph("e-RaktKosh Voluntary Blood Donation Certificate"));
            doc.Add(new Paragraph($"Donation ID (DIN): {din}"));
            doc.Add(new Paragraph($"Donor Name: {donorName}"));
            doc.Add(new Paragraph($"Donation Date: {donationDate:yyyy-MM-dd}"));
            doc.Add(new Paragraph("Blood Center: AFMC Blood Center, Pune"));
        }

        var iTextCert = new X509CertificateBC(cert);
        var iTextKey = new PrivateKeyBC(key);

        using (var reader = new PdfReader(tempPath))
        using (var outputStream = new FileStream(finalPath, FileMode.Create, FileAccess.Write))
        {
            var signer = new PdfSigner(reader, outputStream, new StampingProperties());
            var signature = new PrivateKeySignature(iTextKey, DigestAlgorithms.SHA256);
            signer.SignDetached(signature, new[] { iTextCert }, null, null, null, 0, PdfSigner.CryptoStandard.CMS);
        }

        if (File.Exists(tempPath))
        {
            File.Delete(tempPath);
        }
    }

    private static void GenerateTamperedPdf(string filename, string din, string donorName, DateTime donationDate, AsymmetricKeyParameter key, X509Certificate cert)
    {
        var path = Path.Combine(OutputDir, filename);
        GenerateSignedPdf(filename, din, donorName, donationDate, key, cert);

        using var stream = new FileStream(path, FileMode.Append, FileAccess.Write);
        using var writer = new StreamWriter(stream);
        writer.WriteLine("\n%%TAMPERED_BYTE_PAYLOAD_INVALIDATING_HASH%%");
    }
}