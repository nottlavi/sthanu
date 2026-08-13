using Sthanu.Domain.Common;
using Sthanu.Domain.Enums;

namespace Sthanu.Domain.Entities;

public class Incident : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid? FamilyId { get; set; }

    public required string LocationName { get; set; }
    public required double Latitude { get; set; }
    public required double Longitude { get; set; }

    public ICollection<User> Participants { get; set; } = new List<User>();

    public IncidentStatus Status { get; set; } = IncidentStatus.Active;

    public string ShareCode { get; set; } = Guid.NewGuid().ToString("N")[..6].ToUpper();
}