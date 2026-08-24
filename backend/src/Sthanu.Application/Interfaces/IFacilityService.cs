namespace Sthanu.Application.Interfaces;

using Sthanu.Application.DTOs;
using Sthanu.Domain.Enums;

public interface IFacilityService
{
    Task<ListFacilitiesResponse> GetNearByFacilitiesAsync(double Latitude,
    double Longitude, Guid incidentId, Guid userId, int? Radius);

    Task<RawFacilitiesRes> GetRawFacilitiesAsync(RawFacilitesFetchReq req);
    Task<FacilityResponse> UpdateStockAsync(UpdateStockRequest updateStockRequest);
}