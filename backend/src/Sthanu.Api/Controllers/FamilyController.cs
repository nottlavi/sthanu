using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;

namespace Sthanu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FamilyController : ControllerBase
{
    private readonly IFamilyService _familyService;
    private readonly IUserService _userService;

    public FamilyController(IFamilyService familyService, IUserService userService)
    {
        _familyService = familyService;
        _userService = userService;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> CreateFamilyAsync([FromBody] CreateFamilyRequest request)
    {
        var user = await GetCurrentUserAsync();

        if (user == null) return Unauthorized(new { message = "User not found." });

        try
        {
            var family = await _familyService.CreateFamilyAsync(user.Id, request);
            return Ok(family);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("join")]
    [Authorize]
    public async Task<IActionResult> JoinFamilyAsync([FromBody] JoinFamilyRequest request)
    {
        var user = await GetCurrentUserAsync();

        if (user == null) return Unauthorized(new { message = "User not found." });

        try
        {
            var familyGroup = await _familyService.JoinFamilyAsync(user.Id, request);

            return Ok(familyGroup);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("get-family")]
    [Authorize]
    public async Task<IActionResult> GetFamilyAsync()
    {
        var user = await GetCurrentUserAsync();

        if (user == null) return Unauthorized(new { message = "User not found." });

        try
        {
            var familyGroup = await _familyService.GetFamilyAsync(user.Id);

            return Ok(familyGroup);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var phone = User.FindFirst("phone")?.Value ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrEmpty(phone)) return null;

        return await _userService.GetUserByPhoneAsync(phone);
    }
}