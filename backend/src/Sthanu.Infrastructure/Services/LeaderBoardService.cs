using System.Data.Common;
using iText.Kernel.Colors;
using Microsoft.EntityFrameworkCore;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Infrastructure.Persistence;

namespace Sthanu.Infrastructure.Services;

public class LeaderBoardService : ILeaderBoardService
{
    private readonly ApplicationDbContext _db;

    public LeaderBoardService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<LeaderBoardRes> GetLeaderBoardAsync(Guid userId, LeaderBoardReq leaderBoardReq)
    {
        var user = await _db.Users.Include(u => u.HomeAddress).FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;


        if (leaderBoardReq.Mode == ReqModeType.All)
        {
            var userCards = await _db.Users.OrderByDescending(u => u.TotalDonations).Take(20).Select(u => new UserCard(u.FirstName, u.LastName, u.HomeAddress.City, u.TotalDonations)).ToListAsync();

            var userRank = await _db.Users.CountAsync(u => u.TotalDonations > user.TotalDonations) + 1;

            return new LeaderBoardRes(userCards, userRank);
        }

        else if (leaderBoardReq.Mode == ReqModeType.City)
        {


            var city = user?.HomeAddress?.City;

            if (city == null)
            {
                throw new Exception("User doesn't belong to a City yet");
            }

            var userCards = await _db.Users.Where(u => u.HomeAddress.City == city).OrderByDescending(u => u.TotalDonations).Take(20).Select(u => new UserCard(u.FirstName, u.LastName, u.HomeAddress.City, u.TotalDonations)).ToListAsync();

            var userRank = await _db.Users
    .Where(u => u.HomeAddress.City == city)
    .CountAsync(u => u.TotalDonations > user.TotalDonations) + 1;

            return new LeaderBoardRes(userCards, userRank);
        }

        else if (leaderBoardReq.Mode == ReqModeType.Institute)
        {
            return null;
        }

        return null;
    }
}