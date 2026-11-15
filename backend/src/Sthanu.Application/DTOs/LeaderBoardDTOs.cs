namespace Sthanu.Application.DTOs;

public enum ReqModeType
{
    City = 1,
    All = 2,
    Institute = 3
}

public record LeaderBoardReq(
    ReqModeType Mode
);

public record UserCard(
    string FirstName,
    string LastName,
    string? City,
    int Score
);

public record LeaderBoardRes(
    IReadOnlyList<UserCard> List,
    int userRank
);