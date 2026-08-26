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
public class DonationController : ControllerBase
{
    private readonly IDonationService _donationService;
    private readonly IUserService _userService;

    public DonationController(IDonationService donationService, IUserService userService)
    {
        _donationService = donationService;
        _userService = userService;
    }

    [HttpPost("log")]
    public async Task<IActionResult> LogDonationAsync(IFormFile file, CancellationToken ct)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded." });
        }

        await using var stream = file.OpenReadStream();
        var result = await _donationService.VerifyAndLogDonationAsync(user.Id, stream, ct);

        if (!result.IsTamperFree || !result.IsIssuerTrusted)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var phone = User.FindFirst("phone")?.Value 
                   ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrEmpty(phone)) return null;

        return await _userService.GetUserByPhoneAsync(phone);
    }
}