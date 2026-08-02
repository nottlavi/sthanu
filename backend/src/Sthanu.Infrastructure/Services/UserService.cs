namespace Sthanu.Infrastructure.Services;

using Sthanu.Application.Interfaces;
using Sthanu.Domain.Entities;
using Sthanu.Infrastructure.Persistence;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _db;

    public UserService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<User> CreateUserAsync(string firstName, string lastName, string city, string phoneNumber)
    {
        var user = new User
        {
            FirstName = firstName,
            LastName = lastName,
            City = city,
            PhoneNumber = phoneNumber
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return user;
    }
}
