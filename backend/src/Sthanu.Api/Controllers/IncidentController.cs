namespace Sthanu.Api.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncidentController : ControllerBase
{
    private readonly IIncidentService _incidentService;
    private readonly IUserService _userService;

    public IncidentController(IIncidentService incidentService, IUserService userService)
    {
        _incidentService = incidentService;
        _userService = userService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateIncidentAsync([FromBody] CreateIncidentRequest request)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        try
        {
            var incident = await _incidentService.CreateIncidentAsync(user.Id, request);
            return Ok(incident);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("participate/{shareCode}")]
    public async Task<IActionResult> ParticipateAsync(string shareCode)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        try
        {
            var incident = await _incidentService.ParticipateAsync(user.Id, shareCode);
            if (incident == null)
            {
                return NotFound(new { message = "Incident not found." });
            }

            return Ok(incident);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my-incidents")]
    public async Task<IActionResult> GetUserIncidentsAsync()
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var incidents = await _incidentService.GetUserIncidentsAsync(user.Id);
        return Ok(incidents);
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var phone = User.FindFirst("phone")?.Value 
                   ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrEmpty(phone)) return null;

        return await _userService.GetUserByPhoneAsync(phone);
    }
}
