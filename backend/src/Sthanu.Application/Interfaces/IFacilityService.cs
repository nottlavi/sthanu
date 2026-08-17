namespace Sthanu.Application.Interfaces;

using Sthanu.Application.DTOs;
using Sthanu.Domain.Enums;

public interface IFacilityService
{
    Task<ListFacilitiesResponse> GetNearByFacilitiesAsync(double Latitude,
    double Longitude, IncidentType incidentType);
}