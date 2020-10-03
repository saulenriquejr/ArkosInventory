using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;
using System;

namespace Arkos.Application.Invoices.Queries
{
    public class InvoiceDto : IMapFrom<Invoice>
    {
        public int Id { get; set; }
        public DateTime DateInvoice { get; set; }
        public int PlaceId { get; set; }
    }
}
