using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFacilityWithLocationAndContact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Facilities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Facilities",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Facilities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "Facilities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Facilities",
                type: "text",
                nullable: true);

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

            migrationBuilder.AddColumn<string>(
                name: "Pincode",
                table: "Facilities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Facilities",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Pincode",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Facilities");
        }
    }
}
