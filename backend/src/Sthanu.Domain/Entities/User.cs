namespace Sthanu.Domain.Entities;

using Sthanu.Domain.Common;

public enum UserType
{
    User = 1,
    FacilityAdmin = 2
}

public class User : BaseEntity
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    public string? Email { get; set; }
    public required string PhoneNumber { get; set; }
    // public required string City { get; set; }

    public Guid? FamilyGroupId { get; set; }
    public FamilyGroup? FamilyGroup { get; set; }

    public Address? HomeAddress { get; set; }

    public int TotalDonations { get; set; } = 0;
    public DateTime? NextEligibleDonationDate { get; set; }

    public UserType UserType { get; set; } = (UserType)1;

    public Guid? FacilityId { get; set; }
    public Facility? Facility { get; set; }
}