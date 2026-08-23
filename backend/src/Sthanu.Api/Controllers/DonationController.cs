using Microsoft.AspNetCore.Mvc;
using Sthanu.Application.DTOs;

namespace Sthanu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationController : ControllerBase
{
    [HttpPost("log")]
    public async Task<IActionResult> LogDonationAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        await using var stream = file.OpenReadStream();

        return Ok();
    }
}