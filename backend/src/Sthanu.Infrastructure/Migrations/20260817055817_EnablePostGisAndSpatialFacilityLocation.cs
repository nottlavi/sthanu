using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnablePostGisAndSpatialFacilityLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Facilities");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.AddColumn<Point>(
                name: "Location",
                table: "Facilities",
                type: "geometry",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_Facilities_Location",
                table: "Facilities",
                column: "Location")
                .Annotation("Npgsql:IndexMethod", "gist");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Facilities_Location",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Facilities");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Facilities",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Facilities",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
