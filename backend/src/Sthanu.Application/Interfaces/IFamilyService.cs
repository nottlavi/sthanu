namespace Sthanu.Application.Interfaces;

using Sthanu.Application.DTOs;
using Sthanu.Domain.Entities;

public interface IFamilyService
{
    Task<FamilyGroupResponse> CreateFamilyAsync(Guid userId, CreateFamilyRequest request);
    Task<FamilyGroupResponse?> JoinFamilyAsync(Guid userId, JoinFamilyRequest request);
    Task<FamilyGroupResponse?> GetFamilyAsync(Guid familyId);
}