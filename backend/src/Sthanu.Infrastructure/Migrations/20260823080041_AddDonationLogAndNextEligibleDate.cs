using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDonationLogAndNextEligibleDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "NextEligibleDonationDate",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DonationLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DonationIdNumber = table.Column<string>(type: "text", nullable: false),
                    DonorName = table.Column<string>(type: "text", nullable: false),
                    DonatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BloodBankLicense = table.Column<string>(type: "text", nullable: true),
                    RawHash = table.Column<string>(type: "text", nullable: true),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdaedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonationLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DonationLogs_DonationIdNumber",
                table: "DonationLogs",
                column: "DonationIdNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonationLogs_UserId",
                table: "DonationLogs",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DonationLogs");

            migrationBuilder.DropColumn(
                name: "NextEligibleDonationDate",
                table: "Users");
        }
    }
}
