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
            var hasAdmins = await db.Users.AnyAsync(u => u.UserType == UserType.FacilityAdmin);
            if (hasAdmins)
            {
                return;
            }

            db.Facilities.RemoveRange(await db.Facilities.ToListAsync());
            await db.SaveChangesAsync();
        }

        var phoneNumbers = new[]
        {
            "+918301707263",
            "+918301707264",
            "+918301707265",
            "+918301707266",
            "+918301707267",
            "+918301707268"
        };

        var facilitiesData = new List<(string Name, FacilityType Type, string Category, string Address, string City, string State, string Pincode, Point Location, string Phone, string? Email, List<BloodUnit> BloodUnits)>
        {
            (
                "Medical College Ratlam",
                FacilityType.BloodBank,
                "Govt",
                "Sailana Road, Gram Banjali",
                "Ratlam",
                "Madhya Pradesh",
                "457001",
                new Point(75.0230, 23.3710) { SRID = 4326 },
                "7412299135",
                "bloodcentregmcr@gmail.com",
                new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 61, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Positive, Quantity = 7, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 12, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 31, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.B_Negative, Quantity = 2, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Negative, Quantity = 2, FacilityId = Guid.Empty }
                }
            ),
            (
                "Manav Seva Samiti",
                FacilityType.BloodBank,
                "Charitable/Vol",
                "Nagrik Vishram Grah, College Road",
                "Ratlam",
                "Madhya Pradesh",
                "457001",
                new Point(75.0405, 23.3305) { SRID = 4326 },
                "9425355887",
                "manavsevasamitirtm@rediffmail.com",
                new List<BloodUnit>
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
            ),
            (
                "District Hospital, Ratlam",
                FacilityType.BloodBank,
                "Govt",
                "First Floor, District Govt Pathology, College Road",
                "Ratlam",
                "Madhya Pradesh",
                "457001",
                new Point(75.0398, 23.3312) { SRID = 4326 },
                "9893442771",
                "bloodcentredhratlam@gmail.com",
                new List<BloodUnit>
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
            ),
            (
                "Jaora BSU",
                FacilityType.BSU,
                "Govt",
                "Civil Hospital Campus",
                "Jaora",
                "Madhya Pradesh",
                "457226",
                new Point(75.1242, 23.6325) { SRID = 4326 },
                "07414220025",
                null,
                new List<BloodUnit>
                {
                    new BloodUnit { BloodGroup = BloodGroup.O_Positive, Quantity = 5, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.A_Positive, Quantity = 1, FacilityId = Guid.Empty },
                    new BloodUnit { BloodGroup = BloodGroup.AB_Positive, Quantity = 1, FacilityId = Guid.Empty }
                }
            ),
            (
                "District Hospital, Mandsaur",
                FacilityType.BloodBank,
                "Govt",
                "Hospital Road, Shri Ramtekri",
                "Mandsaur",
                "Madhya Pradesh",
                "458001",
                new Point(75.0684, 24.0722) { SRID = 4326 },
                "9407101767",
                "dr.stark2406@gmail.com",
                new List<BloodUnit>
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
            ),
            (
                "Guru Gautam Muni Blood Centre",
                FacilityType.BloodBank,
                "Private",
                "Plot No. 30-31, Scheme No.1, Kamlbal Kendra Road",
                "Mandsaur",
                "Madhya Pradesh",
                "458001",
                new Point(75.0635, 24.0789) { SRID = 4326 },
                "9999644664",
                "anuyoghospital@gmail.com",
                new List<BloodUnit>
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
            )
        };

        var createdFacilities = new List<Facility>();
        var createdAdmins = new List<User>();

        for (int i = 0; i < facilitiesData.Count; i++)
        {
            var data = facilitiesData[i];
            var facilityId = Guid.NewGuid();

            var facility = new Facility
            {
                Id = facilityId,
                FacilityName = data.Name,
                Type = data.Type,
                Category = data.Category,
                Address = data.Address,
                City = data.City,
                State = data.State,
                Pincode = data.Pincode,
                Location = data.Location,
                ContactPhone = data.Phone,
                Email = data.Email,
                AdminUserId = null,
                BloodUnits = data.BloodUnits
            };

            createdFacilities.Add(facility);
        }

        await db.Facilities.AddRangeAsync(createdFacilities);
        await db.SaveChangesAsync();

        for (int i = 0; i < createdFacilities.Count; i++)
        {
            var facility = createdFacilities[i];
            var phone = phoneNumbers[i];

            var adminUser = new User
            {
                FirstName = facility.FacilityName,
                LastName = "Admin",
                PhoneNumber = phone,
                UserType = UserType.FacilityAdmin,
                FacilityId = facility.Id
            };

            await db.Users.AddAsync(adminUser);
            createdAdmins.Add(adminUser);
        }

        await db.SaveChangesAsync();

        for (int i = 0; i < createdFacilities.Count; i++)
        {
            createdFacilities[i].AdminUserId = createdAdmins[i].Id;
        }

        await db.SaveChangesAsync();
    }
}
