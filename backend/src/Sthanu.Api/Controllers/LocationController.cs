namespace Sthanu.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class LocationController : ControllerBase
{
    private readonly ILocationServices _locationService;

    public LocationController(ILocationServices locationService)
    {
        _locationService = locationService;
    }

    [HttpPost("reverse-geocode")]
    public async Task<IActionResult> ReverseGeocodeAsync([FromBody] ReverseGeocodeRequest request)
    {
        var result = await _locationService.ReverseGeocodeAsync(request);

        if (result == null)
        {
            return NotFound(new { message = "Could not resolve location name for these coordinates." });
        }

        return Ok(result);
    }
}
