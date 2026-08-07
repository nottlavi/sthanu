using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
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

    public async Task<FamilyGroupResponse> CreateFamilyAsync(Guid userId, CreateFamilyRequest request)
    {
        var user = await _db.Users.FindAsync(userId);

        if (user == null) { throw new Exception("User not found"); }

        if (user.FamilyGroupId != null)
        {
            throw new Exception("User already belongs to a family");
        }

        var newFamily = new FamilyGroup
        {
            FamilyName = request.FamilyName,
            AdminUserId = userId,
            Members = new List<User> { user },
        };

        user.FamilyGroupId = newFamily.Id;
        _db.FamilyGroups.Add(newFamily);
        await _db.SaveChangesAsync();

        return MapToFamilyResponse(newFamily);
    }

    public async Task<FamilyGroupResponse?> GetFamilyAsync(Guid familyId)
    {
        var familyGroup = await _db.FamilyGroups.Include(f => f.Members).FirstOrDefaultAsync(f => f.Id == familyId);

        if (familyGroup == null) return null;

        return MapToFamilyResponse(familyGroup);
    }

    public async Task<FamilyGroupResponse?> JoinFamilyAsync(Guid userId, JoinFamilyRequest request)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) { throw new Exception("User not found"); }

        if (user.FamilyGroupId != null)
        {
            throw new Exception("User already belongs to a family group");
        }

        var cleanCode = request.InviteCode.Trim().ToUpper();

        var familyGroup = await _db.FamilyGroups.Include(f => f.Members).FirstOrDefaultAsync(f => f.InviteCode == cleanCode);

        if (familyGroup == null) { throw new Exception("No family found matching this invite code"); }

        if (familyGroup.Members.Count >= 5)
        {
            throw new Exception("Family group has reached the maximum limit of 5 members.");
        }

        familyGroup.Members.Add(user);

        user.FamilyGroupId = familyGroup.Id;

        await _db.SaveChangesAsync();

        return MapToFamilyResponse(familyGroup);
    }

    private static FamilyGroupResponse MapToFamilyResponse(FamilyGroup familyGroup)
    {
        var memberDtos = familyGroup.Members.Select(m => new FamilyMemberDto(
            m.Id,
            m.FirstName,
            m.LastName,
            m.PhoneNumber,
            m.City,
            m.TotalDonations
        )).ToList();

        return new FamilyGroupResponse(
            familyGroup.Id,
            familyGroup.FamilyName,
            familyGroup.InviteCode,
            familyGroup.PooledCredits,
            memberDtos
        );
    }
}