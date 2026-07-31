namespace Sthanu.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Sthanu.Domain.Entities;

public class ApplicationDbContext : DbContext {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {
    }
    public DbSet<User> Users { get; set; }
}