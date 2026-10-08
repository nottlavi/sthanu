using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDonationLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "DonationLogs");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "DonationLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "DonationLogs");

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "DonationLogs",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
