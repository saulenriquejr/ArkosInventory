using Arkos.Domain.Common;
using System;
using System.Collections.Generic;

namespace Arkos.Domain.Entities
{
    public class Invoice : AuditableEntity
    {
        public Invoice()
        {
            InvoiceDetails = new HashSet<InvoiceDetail>();
        }

        public int Id { get; set; }
        public DateTime DateInvoice { get; set; }
        public int PlaceId { get; set; }
        public Place Place { get; set; }
        public int ProviderId { get; set; }
        public Provider Provider { get; set; }
        public ICollection<InvoiceDetail> InvoiceDetails { get; private set; }
    }
}
