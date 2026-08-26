namespace Sthanu.Infrastructure.Services;

using System.Runtime.ConstrainedExecution;
using System.Threading.Tasks.Dataflow;
using iText.Kernel.Colors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
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

    public async Task<ListFacilitiesResponse> GetNearByFacilitiesAsync(double Latitude, double Longitude, Guid incidentId, Guid userId, int? Radius)
    {
        var user = await _db.Users.FindAsync(userId);

        var incident = await _db.Incidents.Include(i => i.Participants).FirstOrDefaultAsync(i => i.Id == incidentId);

        if (incident == null)
        {
            throw new Exception("Incident not found.");
        }

        if (incident.UserId != userId && !incident.Participants.Any(p => p.Id == userId) &&
        !(incident.FamilyId.HasValue && incident.FamilyId == user?.FamilyGroupId))
        {
            throw new Exception("You are not authorized to access this incident.");
        }

        var userLocation = new Point(Longitude, Latitude) { SRID = 4326 };


        var radiusInMeters = Radius * 1000.0;



        List<Facility> facilities;

        if (incident.IncidentType == IncidentType.Blood)
        {
            facilities = await _db.Facilities
          .Include(f => f.BloodUnits).Where(f => f.BloodUnits.Any(b => b.BloodGroup == incident.BloodGroup && b.Quantity > 0)).Where(f => f.Location.Distance(userLocation) <= radiusInMeters)
          .OrderBy(f => f.Location.Distance(userLocation))
          .ToListAsync();
        }
        else
        {
            facilities = await _db.Facilities.Where(f => f.VenomVialsCount > 0).Where(f => f.Location.Distance(userLocation) <= radiusInMeters)
     .OrderBy(f => f.Location.Distance(userLocation))
     .ToListAsync();
        }

        var facilityResponses = facilities.Select(f =>
        {
            var distanceMeters = f.Location.Distance(userLocation);
            var distanceKm = Math.Round(distanceMeters / 1000.0, 1);

            var bloodStockDtos = f.BloodUnits.Where(b => b.BloodGroup == incident.BloodGroup).Where(b => b.BloodGroup == incident.BloodGroup).Select(b => new BloodStockDto(
                b.BloodGroup,
                b.Quantity
            )).ToList();

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
                incident.IncidentType == IncidentType.Blood ? bloodStockDtos : null,
                incident.IncidentType == IncidentType.Venom ? f.VenomVialsCount : null
                );
        }).ToList();

        return new ListFacilitiesResponse(facilityResponses);
    }

    public async Task<RawFacilitiesRes> GetRawFacilitiesAsync(RawFacilitesFetchReq req)
    {
        var userLocation = new Point(req.Longitude, req.Latitude) { SRID = 4326 };

        var facilities = await _db.Facilities.Where(f => f.Location.Distance(userLocation) <= 25000).OrderBy(f => f.Location.Distance(userLocation)).Select(f => new RawFacilityResDTO(f.FacilityName, f.City, Math.Round(f.Location.Distance(userLocation) / 1000.0, 1))).ToListAsync();

        return new RawFacilitiesRes(facilities);
    }


    public async Task<FacilityResponse> UpdateStockAsync(UpdateStockRequest updateStockRequest, Guid userId)
    {
        var facility = await _db.Facilities
    .Include(f => f.BloodUnits)
    .FirstOrDefaultAsync(f => f.Id == updateStockRequest.FacilityId);

        if (facility == null || facility.AdminUserId != userId)
        {
            throw new UnauthorizedAccessException("You are not authorized to update inventory for this facility.");
        }

        if (updateStockRequest.UpdateType == StockUpdateType.Blood || updateStockRequest.UpdateType == StockUpdateType.Both)
        {
            if (updateStockRequest.BloodUnits == null || updateStockRequest.BloodUnits.Count == 0)
            {
                throw new ArgumentException("BloodUnits list is required for Blood stock update.");
            }

            foreach (var bloodDto in updateStockRequest.BloodUnits)
            {
                var existing = facility.BloodUnits.FirstOrDefault(b => b.BloodGroup == bloodDto.BloodGroup);

                if (existing != null)
                {
                    existing.Quantity = Math.Max(0, existing.Quantity + bloodDto.Quantity);
                }
                else if (bloodDto.Quantity > 0)
                {
                    var newUnit = new BloodUnit
                    {
                        FacilityId = facility.Id,
                        BloodGroup = bloodDto.BloodGroup,
                        Quantity = bloodDto.Quantity
                    };

                    _db.BloodUnits.Add(newUnit);
                    facility.BloodUnits.Add(newUnit);
                }
            }
        }

        if (updateStockRequest.UpdateType == StockUpdateType.Venom || updateStockRequest.UpdateType == StockUpdateType.Both)
        {
            if (!updateStockRequest.VenomVials.HasValue)
            {
                throw new ArgumentException("VenomVials is required for Venom stock update.");
            }

            facility.VenomVialsCount = Math.Max(0, facility.VenomVialsCount + updateStockRequest.VenomVials.Value);
        }

        await _db.SaveChangesAsync();

        var bloodStockDtos = facility.BloodUnits.Select(b => new BloodStockDto(b.BloodGroup, b.Quantity)).ToList();

        return new FacilityResponse(
            facility.FacilityName,
            facility.Type,
            facility.Category,
            facility.Address,
            facility.City,
            facility.State,
            facility.Pincode,
            facility.Location.Y,
            facility.Location.X,
            facility.ContactPhone,
            facility.Email,
            null,
            bloodStockDtos,
            facility.VenomVialsCount
        );
    }



}
