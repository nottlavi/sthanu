using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Sthanu.Application.DTOs;
using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Infrastructure.Persistence;

namespace Sthanu.Infrastructure.Services;

public class AddressService : IAddressService
{
    public readonly ApplicationDbContext _db;

    public AddressService(ApplicationDbContext db)
    {
        _db = db;
    }


    public async Task<AddressResponse?> GetUserAddressAsync(Guid userId)
    {
        var userAddress = await _db.Addresses.FirstOrDefaultAsync(a => a.UserId == userId);

        if (userAddress == null) return null;

        return MapToAddressResponse(userAddress);
    }

    public async Task<AddressResponse> SaveUserHomeAddressAsync(Guid userId, SaveAddressRequest request)
    {
        var address = await _db.Addresses.FirstOrDefaultAsync(a => a.UserId == userId);

        if (address != null)
        {
            address.AddressLine = request.AddressLine;
            address.City = request.City;
            address.Landmark = request.Landmark;
            address.State = request.State;
            address.Pincode = request.Pincode;
            address.Latitude = request.Latitude;
            address.Longitude = request.Longitude;

        }

        else
        {
            address = new Address
            {
                AddressLine = request.AddressLine,
                Landmark = request.Landmark,
                City = request.City,
                State = request.State,
                Pincode = request.Pincode,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                UserId = userId,
            };

            await _db.Addresses.AddAsync(address);

        }

        await _db.SaveChangesAsync();

        return MapToAddressResponse(address);
    }

    private static AddressResponse MapToAddressResponse(Address address)
    {
        return new AddressResponse(
            address.Id,
            address.AddressLine,
            address.Landmark,
            address.City,
            address.State,
            address.Pincode,
            address.Latitude,
            address.Longitude
        );
    }

}