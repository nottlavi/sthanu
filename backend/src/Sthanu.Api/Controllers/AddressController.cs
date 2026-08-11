using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Infrastructure.Services;

namespace Sthanu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AddressController : ControllerBase
{
    private readonly IAddressService _addressService;
    private readonly IUserService _userService;

    public AddressController(IAddressService addressService, IUserService userService)
    {
        _addressService = addressService;
        _userService = userService;
    }

    [HttpGet("get-address")]
    [Authorize]
    public async Task<IActionResult> GetUserAddressAsync()
    {
        var user = await GetCurrentUserAsync();

        if (user == null) return Unauthorized(new
        {
            message = "user not found"
        });

        try
        {
            var address = await _addressService.GetUserAddressAsync(user.Id);

            return Ok(address);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }

    }

    [HttpPost("set-address")]
    [Authorize]
    public async Task<IActionResult> SetUserAddress([FromBody] SaveAddressRequest request)
    {
        var user = await GetCurrentUserAsync();

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "user not found"
            });
        }

        try
        {
            var newAddress = await _addressService.SaveUserHomeAddressAsync(
                user.Id, request
            );

            return Ok(newAddress);

        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var phone = User.FindFirst("phone")?.Value ?? User.FindFirst(ClaimTypes.MobilePhone)?.Value;

        if (string.IsNullOrEmpty(phone)) return null;

        return await _userService.GetUserByPhoneAsync(phone);
    }
}