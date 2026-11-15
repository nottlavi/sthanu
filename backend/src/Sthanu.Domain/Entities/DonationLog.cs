namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;
using Sthanu.Domain.Enums;

public class DonationLog : BaseEntity
{
    public required Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string? DonationIdNumber { get; set; } = null;
    public string? DonorName { get; set; } = null;

    public DateTime? DonatedAtUtc { get; set; } = null;
    public string? BloodBankLicense { get; set; } = null;
    public string? RawHash { get; set; } = null;

    public required DonationStatus Status { get; set; } = DonationStatus.InProgress;

    public required string Message { get; set; } = string.Empty;
}