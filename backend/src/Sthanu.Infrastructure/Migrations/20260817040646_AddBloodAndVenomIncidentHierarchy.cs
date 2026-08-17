using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBloodAndVenomIncidentHierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "BloodGroup",
                table: "Incidents",
                type: "smallint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Incidents",
                type: "character varying(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UnitsRequired",
                table: "Incidents",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VialsRequired",
                table: "Incidents",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BloodGroup",
                table: "Incidents");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Incidents");

            migrationBuilder.DropColumn(
                name: "UnitsRequired",
                table: "Incidents");

            migrationBuilder.DropColumn(
                name: "VialsRequired",
                table: "Incidents");
        }
    }
}
