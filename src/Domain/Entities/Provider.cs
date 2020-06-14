using Arkos.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Domain.Entities
{
    public class Provider : AuditableEntity
    {
        public Provider()
        {
            Invoices = new HashSet<Invoice>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Invoice> Invoices { get; private set; }

    }
}
