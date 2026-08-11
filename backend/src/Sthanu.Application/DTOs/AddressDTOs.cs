namespace Sthanu.Application.DTOs;

public record SaveAddressRequest(
    string AddressLine,
    string? Landmark,
    string City,
    string State,
    string Pincode,

    double Latitude,
    double Longitude
);

public record AddressResponse(
    Guid Id,
    string AddressLine,
    string? Landmark,
    string City,
    string State,
    string Pincode,

    double Latitude,
    double Longitude
);