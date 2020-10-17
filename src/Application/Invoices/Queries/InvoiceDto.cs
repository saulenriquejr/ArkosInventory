using Arkos.Application.Common.Mappings;
using Arkos.Application.Invoices.Command;
using Arkos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Application.Invoices.Queries
{
	public class InvoiceDto : IMapFrom<Invoice>
	{
		public InvoiceDto()
		{
			InvoiceDetails = new List<InvoiceDetailDto>();
		}
		public int Id { get; set; }
		public DateTime DateInvoice { get; set; }
		public Place Place { get; set; }
		public Provider Provider { get; set; }
		public IList<InvoiceDetailDto> InvoiceDetails { get; set; }
	}
}
