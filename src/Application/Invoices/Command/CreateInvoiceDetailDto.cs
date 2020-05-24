using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Application.Invoices.Command
{
    public class CreateInvoiceDetailDto
    {
        public int Amount { get; set; }
        public int ProductId { get; set; }
    }
}