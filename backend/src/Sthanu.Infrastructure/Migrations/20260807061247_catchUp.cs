using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class catchUp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_FamilyGroups_FamilyGroupId",
                table: "Users");

            migrationBuilder.AddColumn<Guid>(
                name: "AdminUserId",
                table: "FamilyGroups",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_FamilyGroups_AdminUserId",
                table: "FamilyGroups",
                column: "AdminUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyGroups_Users_AdminUserId",
                table: "FamilyGroups",
                column: "AdminUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_FamilyGroups_FamilyGroupId",
                table: "Users",
                column: "FamilyGroupId",
                principalTable: "FamilyGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyGroups_Users_AdminUserId",
                table: "FamilyGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_FamilyGroups_FamilyGroupId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_FamilyGroups_AdminUserId",
                table: "FamilyGroups");

            migrationBuilder.DropColumn(
                name: "AdminUserId",
                table: "FamilyGroups");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_FamilyGroups_FamilyGroupId",
                table: "Users",
                column: "FamilyGroupId",
                principalTable: "FamilyGroups",
                principalColumn: "Id");
        }
    }
}
