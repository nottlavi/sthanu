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

    private async Task<User?> GetCurrentUserAsync()
    {
        var phone = User.FindFirst("phone")?.Value ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrEmpty(phone)) return null;

        return await _userService.GetUserByPhoneAsync(phone);
    }
}