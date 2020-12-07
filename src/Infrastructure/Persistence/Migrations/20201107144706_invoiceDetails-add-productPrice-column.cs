using Microsoft.EntityFrameworkCore.Migrations;

namespace Arkos.Infrastructure.Persistence.Migrations
{
    public partial class invoiceDetailsaddproductPricecolumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ProductPrice",
                table: "InvoiceDetails",
                type: "Money",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductPrice",
                table: "InvoiceDetails");
        }
    }
}
