namespace Sthanu.Application.Interfaces;

using Sthanu.Domain.Entities;

public interface IUserService
{
    Task<User> CreateUserAsync(string firstName, string lastName, string city, string phoneNumber);
}
