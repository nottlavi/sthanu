namespace Sthanu.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Sthanu.Domain.Entities;
using Sthanu.Domain.Enums;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        if (await db.Facilities.AnyAsync())
        {
            return;
        }

        var facilities = new List<Facility>
        {
            new Facility
            {
                FacilityName = "Medical College Ratlam",
                Type = FacilityType.BloodBank,
                Category = "Govt",
                Address = "Sailana Road, Gram Banjali",
                City = "Ratlam",
                State = "Madhya Pradesh",
                Pincode = "457001",
                Location = new Point(75.0230, 23.3710) { SRID = 4326 },
                ContactPhone = "7412299135",
                Email = "bloodcentregmcr@gmail.com",
                BloodUnits = new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 61, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Positive, Quantity = 7, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 12, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 31, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Negative, Quantity = 2, FacilityId = Guid.Empty }
                }
            },

            new Facility
            {
                FacilityName = "Manav Seva Samiti",
                Type = FacilityType.BloodBank,
                Category = "Charitable/Vol",
                Address = "Nagrik Vishram Grah, College Road",
                City = "Ratlam",
                State = "Madhya Pradesh",
                Pincode = "457001",
                Location = new Point(75.0405, 23.3305) { SRID = 4326 },
                ContactPhone = "9425355887",
                Email = "manavsevasamitirtm@rediffmail.com",
                BloodUnits = new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Negative, Quantity = 6, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 155, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 14, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Negative, Quantity = 11, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Positive, Quantity = 52, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Negative, Quantity = 5, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 25, FacilityId = Guid.Empty }
                }
            },

            new Facility
            {
                FacilityName = "District Hospital, Ratlam",
                Type = FacilityType.BloodBank,
                Category = "Govt",
                Address = "First Floor, District Govt Pathology, College Road",
                City = "Ratlam",
                State = "Madhya Pradesh",
                Pincode = "457001",
                Location = new Point(75.0398, 23.3312) { SRID = 4326 },
                ContactPhone = "9893442771",
                Email = "bloodcentredhratlam@gmail.com",
                BloodUnits = new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 18, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Negative, Quantity = 1, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 11, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Positive, Quantity = 7, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Negative, Quantity = 1, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 5, FacilityId = Guid.Empty }
                }
            },

            new Facility
            {
                FacilityName = "Jaora BSU",
                Type = FacilityType.BSU,
                Category = "Govt",
                Address = "Civil Hospital Campus",
                City = "Jaora",
                State = "Madhya Pradesh",
                Pincode = "457226",
                Location = new Point(75.1242, 23.6325) { SRID = 4326 },
                ContactPhone = "07414220025",
                BloodUnits = new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 5, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 1, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 1, FacilityId = Guid.Empty }
                }
            },

            new Facility
            {
                FacilityName = "District Hospital, Mandsaur",
                Type = FacilityType.BloodBank,
                Category = "Govt",
                Address = "Hospital Road, Shri Ramtekri",
                City = "Mandsaur",
                State = "Madhya Pradesh",
                Pincode = "458001",
                Location = new Point(75.0684, 24.0722) { SRID = 4326 },
                ContactPhone = "9407101767",
                Email = "dr.stark2406@gmail.com",
                BloodUnits = new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Negative, Quantity = 8, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 6, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 1, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Positive, Quantity = 13, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Negative, Quantity = 1, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 7, FacilityId = Guid.Empty }
                }
            },

            new Facility
            {
                FacilityName = "Guru Gautam Muni Blood Centre",
                Type = FacilityType.BloodBank,
                Category = "Private",
                Address = "Plot No. 30-31, Scheme No.1, Kamlbal Kendra Road",
                City = "Mandsaur",
                State = "Madhya Pradesh",
                Pincode = "458001",
                Location = new Point(75.0635, 24.0789) { SRID = 4326 },
                ContactPhone = "9999644664",
                Email = "anuyoghospital@gmail.com",
                BloodUnits = new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Negative, Quantity = 4, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 44, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 21, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Negative, Quantity = 6, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Positive, Quantity = 41, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 12, FacilityId = Guid.Empty }
                }
            }
        };

        await db.Facilities.AddRangeAsync(facilities);
        await db.SaveChangesAsync();
    }
}
