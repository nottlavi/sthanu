namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;
using Sthanu.Domain.Enums;

public class Facility : BaseEntity
{
    public required string FacilityName { get; set; }

    public FacilityType Type { get; set; }

    public ICollection<BloodUnit> BloodUnits { get; set; } = new List<BloodUnit>();
    public ICollection<VenomUnit> VenomUnits { get; set; } = new List<VenomUnit>();
}