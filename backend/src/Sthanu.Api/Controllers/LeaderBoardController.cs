using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Infrastructure.Services;

public class LeaderBoardController : ControllerBase
{
    private readonly ILeaderBoardService _leaderBoardService;
    private readonly IUserService _userService;

    public LeaderBoardController(ILeaderBoardService leaderBoardService, IUserService userService)
    {
        _leaderBoardService = leaderBoardService;
        _userService = userService;
    }

    [HttpGet("get-leaderboard")]
    [Authorize]
    public async Task<IActionResult> GetLeaderBoard([FromQuery] LeaderBoardReq req)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();


        var result = await _leaderBoardService.GetLeaderBoardAsync(user.Id, req);

        if (result == null) return NotFound();

        return Ok(result);
    }

    private async Task<User?> GetCurrentUserAsync()
    {

        var phone = User.FindFirst("phone")?.Value ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrEmpty(phone)) return null;

        return await _userService.GetUserByPhoneAsync(phone);
    }
}