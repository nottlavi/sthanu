namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;

public class User : BaseEntity
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    
    public string? Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required string City { get; set; }
    
    public int TotalDonations { get; set; } = 0;
}