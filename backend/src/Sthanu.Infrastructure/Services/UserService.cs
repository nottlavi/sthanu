namespace Sthanu.Infrastructure.Services;

using Microsoft.EntityFrameworkCore;
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

    public async Task<User> CreateUserAsync(string firstName, string lastName, string phoneNumber)
    {
        var user = new User
        {
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = phoneNumber
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return user;
    }

    public async Task<User?> GetUserByPhoneAsync(string phoneNumber)
    {
        var cleanPhone = phoneNumber.Replace("+", "").Trim();

        Console.WriteLine(cleanPhone);

        return await _db.Users.FirstOrDefaultAsync(u => u.PhoneNumber == cleanPhone);
    }
}
