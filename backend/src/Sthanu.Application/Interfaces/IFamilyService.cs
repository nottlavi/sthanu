namespace Sthanu.Application.Interfaces;

using Sthanu.Application.DTOs;
using Sthanu.Domain.Entities;

public interface IFamilyService
{
    Task<FamilyGroupResponse> CreateFamilyAsync(Guid id, CreateFamilyRequest request);
    Task<FamilyGroupResponse?> JoinFamilyAsync(Guid id, JoinFamilyRequest request);
    Task<FamilyGroupResponse?> GetFamilyAsync(Guid id);
}