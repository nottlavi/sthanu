using Sthanu.Domain.Common;

namespace Sthanu.Domain.Entities;

public class FamilyGroup : BaseEntity
{
    public required string FamilyName { get; set; }
    public string InviteCode { get; private set; } = Guid.NewGuid().ToString("N")[..6].ToUpper();

    public int PooledCredits { get; set; } = 0;
    public ICollection<User> Members { get; set; } = new List<User>();
}