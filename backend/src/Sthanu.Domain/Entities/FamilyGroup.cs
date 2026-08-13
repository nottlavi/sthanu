namespace Sthanu.Domain.Entities;

using System.ComponentModel.DataAnnotations.Schema;
using Sthanu.Domain.Common;

public class FamilyGroup : BaseEntity
{
    public required string FamilyName { get; set; }
    public string InviteCode { get; private set; } = Guid.NewGuid().ToString("N")[..6].ToUpper();

    public Guid AdminUserId { get; set; }
    [ForeignKey(nameof(AdminUserId))]
    public User AdminUser { get; set; } = null!;

    public int PooledCredits { get; set; } = 0;
    public ICollection<User> Members { get; set; } = new List<User>();
}