namespace Sthanu.Application.DTOs;

using Sthanu.Domain.Enums;

public record GetNearestFacilitiesRequest(
    double Latitude,
    double Longitude,
    IncidentType IncidentType
);

public record BloodStockDto(
    BloodGroup BloodGroup,
    int Quantity
);

public record VenomStockDto(
    string Type,
    int Quantity
);

public record FacilityResponse
(
    string FacilityName,
    FacilityType Type,
    string? Category,
    string Address,
    string City,
    string State,
    string Pincode,
    double Latitude,
    double Longitude,
    string ContactPhone,
    string? Email,
    double DistanceKm,
    List<BloodStockDto>? BloodUnits,
    List<VenomStockDto> VenomUnits
);

public record ListFacilitiesResponse(
    List<FacilityResponse> Facilities
);