using Arkos.Domain.Common;

namespace Arkos.Domain.Entities
{
    public class InventoryDetail
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ManualCount { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal TotalSale { get; set; }
    }
}