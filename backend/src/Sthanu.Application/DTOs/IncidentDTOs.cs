using Sthanu.Domain.Enums;

namespace Sthanu.Application.DTOs;

public record CreateIncidentRequest(
    IncidentType IncidentType,
    string LocationName,
    double Latitude,
    double Longitude,
    BloodGroup? BloodGroup = null,
    int? UnitsRequired = null,
    int? VialsRequired = null
);

public record IncidentParticipantDto(
    Guid Id,
    string FirstName,
    string LastName,
    string PhoneNumber
);

public record IncidentResponse(
    Guid Id,
    Guid UserId,
    Guid? FamilyId,
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
