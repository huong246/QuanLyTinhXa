using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ord.Tutorial.Migrations
{
    /// <inheritdoc />
    public partial class Added_ConcurrencyStamp_To_Province : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProvinceEntityId",
                table: "Wards",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Provinces",
                type: "varchar(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "Provinces",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Wards_ProvinceEntityId",
                table: "Wards",
                column: "ProvinceEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wards_Provinces_ProvinceEntityId",
                table: "Wards",
                column: "ProvinceEntityId",
                principalTable: "Provinces",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wards_Provinces_ProvinceEntityId",
                table: "Wards");

            migrationBuilder.DropIndex(
                name: "IX_Wards_ProvinceEntityId",
                table: "Wards");

            migrationBuilder.DropColumn(
                name: "ProvinceEntityId",
                table: "Wards");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Provinces");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "Provinces");
        }
    }
}
