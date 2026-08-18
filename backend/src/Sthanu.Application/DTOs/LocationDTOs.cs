namespace Sthanu.Application.DTOs;

public record ReverseGeocodeRequest(
    double Latitude,
    double Longitude
);

public record ReverseGeocodeResponse(
    string PlaceName,
    string? City,
    string? State,
    string? Pincode
);

