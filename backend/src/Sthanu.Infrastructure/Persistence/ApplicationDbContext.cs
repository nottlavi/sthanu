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
    public DbSet<FamilyGroup> FamilyGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasOne(u => u.FamilyGroup).WithMany(f => f.Members).HasForeignKey(u => u.FamilyGroupId).OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<FamilyGroup>().HasOne(f => f.AdminUser).WithMany().HasForeignKey(f => f.AdminUserId).OnDelete(DeleteBehavior.Restrict);
    }
}