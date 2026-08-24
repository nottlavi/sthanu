using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFacilityAdminAndUserFacility : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FacilityId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AdminUserId",
                table: "Facilities",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_FacilityId",
                table: "Users",
                column: "FacilityId");

            migrationBuilder.CreateIndex(
                name: "IX_Facilities_AdminUserId",
                table: "Facilities",
                column: "AdminUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Facilities_Users_AdminUserId",
                table: "Facilities",
                column: "AdminUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Facilities_FacilityId",
                table: "Users",
                column: "FacilityId",
                principalTable: "Facilities",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Facilities_Users_AdminUserId",
                table: "Facilities");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Facilities_FacilityId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_FacilityId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Facilities_AdminUserId",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "FacilityId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AdminUserId",
                table: "Facilities");
        }
    }
}
