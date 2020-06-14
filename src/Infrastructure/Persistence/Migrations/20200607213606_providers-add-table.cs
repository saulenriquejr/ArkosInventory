using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Arkos.Infrastructure.Persistence.Migrations
{
    public partial class providersaddtable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Places",
                table: "Invoices");

            migrationBuilder.AddColumn<int>(
                name: "ProviderId",
                table: "Invoices",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Providers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<string>(nullable: true),
                    LastModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Providers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_ProviderId",
                table: "Invoices",
                column: "ProviderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Places",
                table: "Invoices",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Providers",
                table: "Invoices",
                column: "ProviderId",
                principalTable: "Providers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Places",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Providers",
                table: "Invoices");

            migrationBuilder.DropTable(
                name: "Providers");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_ProviderId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "ProviderId",
                table: "Invoices");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Places",
                table: "Invoices",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
