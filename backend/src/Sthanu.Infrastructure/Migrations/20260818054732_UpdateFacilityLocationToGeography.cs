using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFacilityLocationToGeography : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Point>(
                name: "Location",
                table: "Facilities",
                type: "geography(Point, 4326)",
                nullable: false,
                oldClrType: typeof(Point),
                oldType: "geometry");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Point>(
                name: "Location",
                table: "Facilities",
                type: "geometry",
                nullable: false,
                oldClrType: typeof(Point),
                oldType: "geography(Point, 4326)");
        }
    }
}
