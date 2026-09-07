namespace Sthanu.Api.Controllers;

using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql.EntityFrameworkCore.PostgreSQL.Storage.Internal;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Domain.Enums;

[ApiController]
[Route("api/[Controller]")]
public class FacilityController : ControllerBase
{
    private readonly IFacilityService _facilityService;
    private readonly IUserService _userService;

    public FacilityController(IFacilityService facilityService, IUserService userService)
    {
        _facilityService = facilityService;
        _userService = userService;
    }

    [Authorize]
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
            var facilities = await _facilityService.GetNearByFacilitiesAsync(request.Latitude, request.Longitude, request.IncidentId, user.Id, request.Radius ?? 25);

            return Ok(facilities);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("get-raw")]
    public async Task<IActionResult>
    GetRawFacilitiesAsync([FromBody] RawFacilitesFetchReq fetchReq)
    {
        try
        {
            var facilities = await _facilityService.GetRawFacilitiesAsync(fetchReq);

            return Ok(facilities);
        }
        catch (Exception err)
        {
            return BadRequest(new { message = err.Message });
        }
    }

    [Authorize]
    [HttpPut("update-stock")]
    public async Task<IActionResult> UpdateStockAsync([FromBody] UpdateStockRequest request)
    {
        var user = await GetCurrentUserAsync();

        try
        {
            var res = await _facilityService.UpdateStockAsync(request, user.Id);

            return Ok(res);
        }
        catch (Exception err)
        {
            return BadRequest(new { message = err.Message });
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