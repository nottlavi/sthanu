namespace Sthanu.Application.Interfaces;

using Sthanu.Application.DTOs;

public interface ILocationServices
{
    Task<ReverseGeocodeResponse?> ReverseGeocodeAsync(ReverseGeocodeRequest request);
}