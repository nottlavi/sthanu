namespace Sthanu.Application.Interfaces;

using Sthanu.Application.DTOs;

public interface IIncidentService
{
    Task<IncidentResponse> CreateIncidentAsync(Guid userId, CreateIncidentRequest request);
    Task<IncidentResponse?> ParticipateAsync(Guid userId, string shareCode);
    Task<IReadOnlyList<IncidentResponse>> GetUserIncidentsAsync(Guid userId);
}