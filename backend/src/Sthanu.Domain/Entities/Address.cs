using Sthanu.Domain.Common;

namespace Sthanu.Domain.Entities;

public class Address : BaseEntity
{
    public required Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public required string AddressLine { get; set; }

    public string? Landmark { get; set; }

    public required string City { get; set; }

    public required string State { get; set; }

    public required string Pincode { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }
}