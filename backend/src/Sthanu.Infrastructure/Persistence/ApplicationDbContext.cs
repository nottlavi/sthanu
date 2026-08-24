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
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Incident> Incidents { get; set; }
    public DbSet<DonationLog> DonationLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresExtension("postgis");

        modelBuilder.Entity<User>().HasOne(u => u.FamilyGroup).WithMany(f => f.Members).HasForeignKey(u => u.FamilyGroupId).OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<User>().HasOne(u => u.HomeAddress).WithOne(a => a.User).HasForeignKey<Address>(a => a.UserId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Facility)
            .WithMany()
            .HasForeignKey(u => u.FacilityId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Facility>()
            .HasOne(f => f.AdminUser)
            .WithMany()
            .HasForeignKey(f => f.AdminUserId)
            .OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<FamilyGroup>().HasOne(f => f.AdminUser).WithMany().HasForeignKey(f => f.AdminUserId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Incident>().HasMany(i => i.Participants).WithMany();

        modelBuilder.Entity<Facility>()
            .Property(f => f.Location)
            .HasColumnType("geography(Point, 4326)");

        modelBuilder.Entity<Facility>().HasIndex(f => f.Location).HasMethod("gist");

        modelBuilder.Entity<DonationLog>()
            .HasIndex(d => d.DonationIdNumber)
            .IsUnique();
    }
}