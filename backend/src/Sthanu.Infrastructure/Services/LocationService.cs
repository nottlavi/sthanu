using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Infrastructure.Persistence;

namespace Sthanu.Infrastructure.Services;

public class LocationService : ILocationServices
{
    private readonly ApplicationDbContext _db;
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public LocationService(ApplicationDbContext db, HttpClient httpClient, IConfiguration config)
    {
        _db = db;
        _httpClient = httpClient;
        _apiKey = config["OpenRouteService:ApiKey"];
    }

    public async Task<ReverseGeocodeResponse?> ReverseGeocodeAsync(ReverseGeocodeRequest request)
    {
        var url = $"https://api.openrouteservice.org/geocode/reverse?api_key={_apiKey}&point.lon={request.Longitude}&point.lat={request.Latitude}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode) return null;

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        var root = doc.RootElement;

        if (!root.TryGetProperty("features", out var features) || features.GetArrayLength() == 0)
        {
            return null;
        }

        var properties = features[0].GetProperty("properties");

        var placeName = properties.TryGetProperty("label", out var labelProp)
    ? labelProp.GetString()
    : (properties.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : "Unknown Location");
        var city = properties.TryGetProperty("locality", out var cityProp)
            ? cityProp.GetString()
            : (properties.TryGetProperty("county", out var countyProp) ? countyProp.GetString() : null);
        var state = properties.TryGetProperty("region", out var stateProp)
            ? stateProp.GetString()
            : null;
        var pincode = properties.TryGetProperty("postalcode", out var pinProp)
            ? pinProp.GetString()
            : null;

        return new ReverseGeocodeResponse(
            placeName ?? "Unknown Location",
            city,
            state,
            pincode
        );
    }
}