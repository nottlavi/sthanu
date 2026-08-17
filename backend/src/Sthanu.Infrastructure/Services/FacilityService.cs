namespace Sthanu.Infrastructure.Services;

using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Domain.Enums;
using Sthanu.Infrastructure.Persistence;

public class FacilityService : IFacilityService
{
    private readonly ApplicationDbContext _db;

    public FacilityService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ListFacilitiesResponse> GetNearByFacilitiesAsync(double Latitude, double Longitude, IncidentType incidentType)
    {
        var userLocation = new Point(Longitude, Latitude) { SRID = 4326 };

        List<Facility> facilities;

        if (incidentType == IncidentType.Blood)
        {
            facilities = await _db.Facilities
          .Include(f => f.BloodUnits)
          .OrderBy(f => f.Location.Distance(userLocation))
          .ToListAsync();
        }
        else
        {
            facilities = await _db.Facilities
     .Include(f => f.VenomUnits)
     .OrderBy(f => f.Location.Distance(userLocation))
     .ToListAsync();
        }

        var facilityResponses = facilities.Select(f =>
        {
            var distanceMeters = f.Location.Distance(userLocation);
            var distanceKm = Math.Round(distanceMeters / 1000.0, 1);

            var bloodStockDtos = f.BloodUnits.Select(b => new BloodStockDto(
                b.BloodGroup,
                b.Quantity
            )).ToList();

            var venomStocksDtos = f.VenomUnits.Select(v => new VenomStockDto(v.Type, v.Quantity))
            .ToList();

            return new FacilityResponse(
                f.FacilityName,
                f.Type,
                f.Category,
                f.Address,
                f.City,
                f.State,
                f.Pincode,
                f.Location.Y,
                f.Location.X,
                f.ContactPhone,
                f.Email,
                distanceKm,
                bloodStockDtos,
                venomStocksDtos
            );
        }).ToList();

        return new ListFacilitiesResponse(facilityResponses);
    }
}
