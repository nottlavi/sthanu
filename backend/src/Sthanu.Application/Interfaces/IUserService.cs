namespace Sthanu.Application.Interfaces;

using Sthanu.Domain.Entities;

public interface IUserService
{
    Task<User?> GetUserByPhoneAsync(string phoneNumber);
    Task<User> CreateUserAsync(string firstName, string lastName, string phoneNumber);
}
