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
    private readonly ISupabaseAuthService _supabaseAuthService;

    public AuthController(IUserService userService, ISupabaseAuthService supabaseAuthService)
    {
        _userService = userService;
        _supabaseAuthService = supabaseAuthService;
    }

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtpAsync([FromBody] SendOtpRequest request)
    {
        var (success, message) = await _supabaseAuthService.SendOtpAsync(request.PhoneNumber);

        if (!success) return BadRequest(new { message = "Failed to send OTP", error = message });

        return Ok(new { message = $"OTP sent successfully to {request.PhoneNumber}" });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var (success, accessToken, message) = await _supabaseAuthService.VerifyOtpAsync(request.PhoneNumber, request.OtpCode);

        if (!success) return BadRequest(new { message = "Invalid or expired OTP", error = message });

        var existingUser = await _userService.GetUserByPhoneAsync(request.PhoneNumber);

        // Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(existingUser));


        if (existingUser != null)
        {
            return Ok(new
            {
                message = "Login successfull",
                token = accessToken,
                isProfileComplete = true,
                user = existingUser
            });
        }



        return Ok(new { message = "OTP verified successfully", token = accessToken, isProfileComplete = false });
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

        var existingUser = await _userService.GetUserByPhoneAsync(phoneNumber);

        if (existingUser != null)
        {
            return BadRequest(new
            {
                message = "User profile for this phone number is already registered.",
            });
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