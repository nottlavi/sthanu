namespace Sthanu.Application.DTOs;

using System.Threading.Tasks.Dataflow;
using Sthanu.Domain.Enums;

public record GetNearestFacilitiesRequest(
    double Latitude,
    double Longitude,
    Guid IncidentId
);

public record BloodStockDto(
    BloodGroup BloodGroup,
    int Quantity
);

public record VenomStockDto(
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