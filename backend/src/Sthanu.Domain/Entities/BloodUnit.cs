namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;
using Sthanu.Domain.Enums;

public class BloodUnit : BaseEntity
{
    public required BloodGroup BloodGroup { get; set; }
    public required int Quantity { get; set; } = 0;

    public required Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;
}