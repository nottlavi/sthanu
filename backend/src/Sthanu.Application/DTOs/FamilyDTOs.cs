namespace Sthanu.Application.DTOs;

public record CreateFamilyRequest(string FamilyName);

public record JoinFamilyRequest(string InviteCode);

public record FamilyMemberDto(
    Guid Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string City,
    int TotalDonations
);

public record FamilyGroupResponse(
    Guid Id,
    string FamilyName,
    string InviteCode,
    int PooledCredits,
    List<FamilyMemberDto> Members
);
