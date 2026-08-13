using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sthanu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFamilyGroupEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FamilyGroupId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FamilyGroups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FamilyName = table.Column<string>(type: "text", nullable: false),
                    InviteCode = table.Column<string>(type: "text", nullable: false),
                    PooledCredits = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdaedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyGroups", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_FamilyGroupId",
                table: "Users",
                column: "FamilyGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_FamilyGroups_FamilyGroupId",
                table: "Users",
                column: "FamilyGroupId",
                principalTable: "FamilyGroups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_FamilyGroups_FamilyGroupId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "FamilyGroups");

            migrationBuilder.DropIndex(
                name: "IX_Users_FamilyGroupId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FamilyGroupId",
                table: "Users");
        }
    }
}
