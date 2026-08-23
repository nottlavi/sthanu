namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;

public class DonationLog : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public required string DonationIdNumber { get; set; }
    public required string DonorName { get; set; }
    public DateTime DonatedAtUtc { get; set; }
    public string? BloodBankLicense { get; set; }
    public string? RawHash { get; set; }
    public bool IsVerified { get; set; } = false;
}