using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Infrastructure.Persistence;

namespace Sthanu.Infrastructure.Services;

public class FamilyService : IFamilyService
{
    private readonly ApplicationDbContext _db;

    public FamilyService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<FamilyGroupResponse> CreateFamilyAsync(Guid id, CreateFamilyRequest request)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null) { throw new Exception("User not found"); }

        if (user.FamilyGroupId != null)
        {
            throw new Exception("User already belongs to a family");
        }

        var newFamily = new FamilyGroup
        {
            FamilyName = request.FamilyName,
            AdminUserId = id,
            Members = new List<User> { user },
        };

        user.FamilyGroupId = newFamily.Id;
        _db.FamilyGroups.Add(newFamily);
        await _db.SaveChangesAsync();

        var memberDtos = newFamily.Members.Select(m => new FamilyMemberDto(
        m.Id,
        m.FirstName,
        m.LastName,
        m.PhoneNumber,
        m.City,
        m.TotalDonations
    )).ToList();

        return new FamilyGroupResponse
        (
            newFamily.Id,
            newFamily.FamilyName,
            newFamily.InviteCode,
            newFamily.PooledCredits,
            memberDtos
        );
    }

    public Task<FamilyGroupResponse?> GetFamilyAsync(Guid Id)
    {
        throw new NotImplementedException();
    }

    public Task<FamilyGroupResponse?> JoinFamilyAsync(Guid Id, JoinFamilyRequest request)
    {
        throw new NotImplementedException();
    }
}