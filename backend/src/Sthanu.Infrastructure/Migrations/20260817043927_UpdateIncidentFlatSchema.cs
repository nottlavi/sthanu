using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIncidentFlatSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Incidents");

            migrationBuilder.AddColumn<byte>(
                name: "IncidentType",
                table: "Incidents",
                type: "smallint",
                nullable: false,
                defaultValue: (byte)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IncidentType",
                table: "Incidents");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Incidents",
                type: "character varying(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");
        }
    }
}
