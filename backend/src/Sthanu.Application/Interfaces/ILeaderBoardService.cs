using Sthanu.Application.DTOs;

namespace Sthanu.Application.Interfaces;

public interface ILeaderBoardService
{
    Task<LeaderBoardRes> GetLeaderBoardAsync(Guid userId, LeaderBoardReq leaderBoardReq);
}