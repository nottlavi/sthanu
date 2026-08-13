using Sthanu.Application.DTOs;
using Sthanu.Domain.Entities;

namespace Sthanu.Application.Interfaces;

public interface IAddressService
{
    Task<AddressResponse> SaveUserHomeAddressAsync(Guid userId, SaveAddressRequest request);
    Task<AddressResponse?> GetUserAddressAsync(Guid userId);
}