namespace Sthanu.Api.Controllers;

using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Domain.Enums;

[ApiController]
[Route("api/[Controller]")]
[Authorize]
public class FacilityController : ControllerBase
{
    private readonly IFacilityService _facilityService;
    private readonly IUserService _userService;

    public FacilityController(IFacilityService facilityService, IUserService userService)
    {
        _facilityService = facilityService;
        _userService = userService;
    }

    [HttpPost("get-nearest")]
    public async Task<IActionResult> GetNearestFacilitiesAsync([FromBody] GetNearestFacilitiesRequest request)
    {
        var user = await GetCurrentUserAsync();

        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        try
        {
            var facilities = await _facilityService.GetNearByFacilitiesAsync(request.Latitude, request.Longitude, request.IncidentId, user.Id);

            return Ok(facilities);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var phone = User.FindFirst("phone")?.Value
                   ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrEmpty(phone)) return null;

        return await _userService.GetUserByPhoneAsync(phone);
    }
}