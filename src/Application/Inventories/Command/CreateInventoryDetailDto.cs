namespace Arkos.Application.Inventories.Command
{
    public class CreateInventoryDetailDto
    {
        public int ProductId { get; set; }
        public int ManualCount { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal TotalSale { get; set; }
    }
}