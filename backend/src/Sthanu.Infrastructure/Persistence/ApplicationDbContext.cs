namespace Sthanu.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Sthanu.Domain.Entities;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Facility> Facilities { get; set; }
    public DbSet<BloodUnit> BloodUnits { get; set; }
    public DbSet<VenomUnit> VenomUnits { get; set; }
}