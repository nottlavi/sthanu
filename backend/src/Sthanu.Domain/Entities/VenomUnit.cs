namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;

public class VenomUnit : BaseEntity
{
    public required int Quantity { get; set; } = 0;

    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;
}