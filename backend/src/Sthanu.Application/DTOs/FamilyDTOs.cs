using Sthanu.Domain.Enums;

namespace Sthanu.Application.DTOs;

public record CreateFamilyRequest(string FamilyName);

public record JoinFamilyRequest(string InviteCode);

public record FamilyMemberDto(
    Guid Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    int TotalDonations
);

public record FamilyIncidentDto(
     Guid Id,
    Guid UserId,
    IncidentType IncidentType,
    string LocationName,
    double Latitude,
    double Longitude,
    BloodGroup? BloodGroup,
    int? UnitsRequired,
    int? VialsRequired,
    string ShareCode,
    IncidentStatus Status,
    DateTime CreatedAtUtc,
    List<IncidentParticipantDto> Participants
);

public record FamilyGroupResponse(
    Guid Id,
    string FamilyName,
    string InviteCode,
    int PooledCredits,
    List<FamilyMemberDto> Members,
    List<FamilyIncidentDto>? FamilyIncidents
);
