using Arkos.Domain.Common;

namespace Arkos.Domain.Entities
{
    public class InvoiceDetail
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int ProductId { get; set; }
        public decimal ProductPrice { get; set; }
        public Product Product { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
    }
}
