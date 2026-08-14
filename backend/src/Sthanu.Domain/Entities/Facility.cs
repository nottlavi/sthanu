namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;
using Sthanu.Domain.Enums;

public class Facility : BaseEntity
{
    public required string FacilityName { get; set; }

    public FacilityType Type { get; set; }
    public string? Category { get; set; }

    public required string Address { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public required string Pincode { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public required string ContactPhone { get; set; }
    public string? Email { get; set; }

    public ICollection<BloodUnit> BloodUnits { get; set; } = new List<BloodUnit>();
    public ICollection<VenomUnit> VenomUnits { get; set; } = new List<VenomUnit>();
}