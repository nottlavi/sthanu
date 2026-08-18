namespace Sthanu.Infrastructure.Services;

using Microsoft.EntityFrameworkCore;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Domain.Enums;
using Sthanu.Infrastructure.Persistence;

public class IncidentService : IIncidentService
{
    private readonly ApplicationDbContext _db;

    public IncidentService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IncidentResponse> CreateIncidentAsync(Guid userId, CreateIncidentRequest request)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var hasActiveIncident = await _db.Incidents.AnyAsync(i =>
            i.UserId == userId && i.Status == IncidentStatus.Active);

        if (hasActiveIncident)
        {
            throw new Exception("User already has an active emergency incident.");
        }

        if (request.IncidentType == IncidentType.Blood)
        {
            if (request.BloodGroup == null)
            {
                throw new Exception("BloodGroup is required for a Blood emergency incident.");
            }

            if (request.VialsRequired.HasValue)
            {
                throw new Exception("VialsRequired cannot be provided for a Blood emergency incident.");
            }

            if (request.UnitsRequired.HasValue && request.UnitsRequired <= 0)
            {
                throw new Exception("UnitsRequired must be at least 1.");
            }
        }
        else if (request.IncidentType == IncidentType.Venom)
        {
            if (request.BloodGroup.HasValue)
            {
                throw new Exception("BloodGroup cannot be provided for a Venom emergency incident.");
            }

            if (request.UnitsRequired.HasValue)
            {
                throw new Exception("UnitsRequired cannot be provided for a Venom emergency incident.");
            }

            if (request.VialsRequired.HasValue && request.VialsRequired <= 0)
            {
                throw new Exception("VialsRequired must be at least 1.");
            }
        }

        var incident = new Incident
        {
            UserId = userId,
            FamilyId = user.FamilyGroupId,
            IncidentType = request.IncidentType,
            LocationName = request.LocationName,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            BloodGroup = request.IncidentType == IncidentType.Blood ? request.BloodGroup : null,
            UnitsRequired = request.IncidentType == IncidentType.Blood ? (request.UnitsRequired ?? 1) : null,
            VialsRequired = request.IncidentType == IncidentType.Venom ? (request.VialsRequired ?? 1) : null,
            Status = IncidentStatus.Active
        };

        await _db.Incidents.AddAsync(incident);
        await _db.SaveChangesAsync();

        return MapToIncidentResponse(incident);
    }

    public async Task<IncidentResponse?> ParticipateAsync(Guid userId, string shareCode)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var cleanCode = shareCode.Trim().ToUpper();

        var incident = await _db.Incidents
            .Include(i => i.Participants)
            .FirstOrDefaultAsync(i => i.ShareCode == cleanCode);

        if (incident == null)
        {
            throw new Exception("No incident found matching this invite code.");
        }

        if (incident.Status != IncidentStatus.Active)
        {
            throw new Exception("This emergency incident is no longer active.");
        }

        if (incident.UserId == userId || incident.Participants.Any(p => p.Id == userId))
        {
            throw new Exception("You are not allowed to rejoin.");
        }

        incident.Participants.Add(user);
        await _db.SaveChangesAsync();

        return MapToIncidentResponse(incident);
    }

    public async Task<IReadOnlyList<IncidentResponse>> GetUserIncidentsAsync(Guid userId)
    {
        var incidents = await _db.Incidents
            .Where(i => i.UserId == userId || i.Participants.Any(p => p.Id == userId))
            .Include(i => i.Participants)
            .OrderByDescending(i => i.CreatedAtUtc)
            .ToListAsync();

        return incidents.Select(MapToIncidentResponse).ToList();
    }

    private static IncidentResponse MapToIncidentResponse(Incident incident)
    {
        var participantDtos = incident.Participants.Select(p => new IncidentParticipantDto(
            p.Id,
            p.FirstName,
            p.LastName,
            p.PhoneNumber
        )).ToList();

        return new IncidentResponse(
            incident.Id,
            incident.UserId,
            incident.FamilyId,
            incident.IncidentType,
            incident.LocationName,
            incident.Latitude,
            incident.Longitude,
            incident.BloodGroup,
            incident.UnitsRequired,
            incident.VialsRequired,
            incident.ShareCode,
            incident.Status,
            incident.CreatedAtUtc,
            participantDtos
        );
    }
}
