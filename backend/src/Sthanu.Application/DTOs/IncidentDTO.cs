namespace Sthanu.Application.DTOs;

using Sthanu.Domain.Enums;

public record BloodStockDto(
    BloodGroup BloodGroup,
    int Quantity
);

public record ListIncidentResponse
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
    List<BloodStockDto> BloodUnits
);