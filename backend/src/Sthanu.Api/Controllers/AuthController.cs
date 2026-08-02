namespace Sthanu.Api.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("send-otp")]
    public IActionResult SendOtp([FromBody] SendOtpRequest request)
    {
        return Ok(new { message = $"OTP sent successfully to {request.PhoneNumber}" });
    }

    [HttpPost("verify-otp")]
    public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        return Ok(new { message = "OTP verified successfully", token = "mock-jwt-token" });
    }

    [HttpPost("complete-profile")]
    [Authorize]
    public async Task<IActionResult> CompleteProfile([FromBody] CompleteProfileRequest request)
    {
        var phoneNumber = User.FindFirst("phone")?.Value
                         ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return BadRequest(new { message = "A verified phone number is required to complete registration." });
        }

        var user = await _userService.CreateUserAsync(
            request.FirstName,
            request.LastName,
            request.City,
            phoneNumber
        );

        return Ok(user);
    }
}