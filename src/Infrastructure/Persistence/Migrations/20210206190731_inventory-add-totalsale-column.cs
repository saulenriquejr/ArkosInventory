using Microsoft.EntityFrameworkCore.Migrations;

namespace Arkos.Infrastructure.Persistence.Migrations
{
    public partial class inventoryaddtotalsalecolumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<decimal>(
                name: "TotalSale",
                table: "Inventories",
                type: "Money",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "TotalSale",
                table: "Inventories");
        }
    }
}
