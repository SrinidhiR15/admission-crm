using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<ProgramEntity> Programs { get; set; } = null!;
        public DbSet<Applicant> Applicants { get; set; } = null!;
        public DbSet<Admission> Admissions { get; set; } = null!;
        public DbSet<SeatMatrix> SeatMatrices { get; set; } = null!;
    }
}