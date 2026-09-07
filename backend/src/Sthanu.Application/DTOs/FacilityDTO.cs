namespace Sthanu.Application.DTOs;

using System.Threading.Tasks.Dataflow;
using Sthanu.Domain.Enums;

public enum StockUpdateType
{
    Blood = 1,
    Venom = 2,
    Both = 3
}

public record GetNearestFacilitiesRequest(
    double Latitude,
    double Longitude,
    Guid IncidentId,
    int? Radius
);

public record RawFacilitesFetchReq(
    double Latitude,
    double Longitude
);

public record RawFacilityResDTO(
    string FacilityName,
    string City,
    double DistanceKm
);

public record RawFacilitiesRes(
    List<RawFacilityResDTO> Facilties
);

public record BloodStockDto(
    BloodGroup BloodGroup,
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
    double? DistanceKm,
    List<BloodStockDto>? BloodUnits,
    int? VenomVialsCount
);

public record ListFacilitiesResponse(
    List<FacilityResponse> Facilities
);

public record UpdateStockRequest(
    Guid FacilityId,
    StockUpdateType UpdateType,
List<BloodStockDto>? BloodUnits,
    int? VenomVials
);