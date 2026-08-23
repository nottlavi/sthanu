namespace Sthanu.Application.Interfaces;

using Sthanu.Application.DTOs;

public interface IDonationService
{
    Task<LogDonationRes> VerifyAndLogDonationAsync(Guid userId, Stream pdfStream, CancellationToken ct = default);
}
