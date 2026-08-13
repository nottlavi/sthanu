using Sthanu.Domain.Enums;

namespace Sthanu.Application.DTOs;

public record CreateIncidentRequest(
    string LocationName,
    double Latitude,
    double Longitude
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
    string LocationName,
    double Latitude,
    double Longitude,
    string ShareCode,
    IncidentStatus Status,
    DateTime CreatedAtUtc,
    List<IncidentParticipantDto> Participants
);
