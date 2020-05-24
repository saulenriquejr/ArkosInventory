using Arkos.Domain.Common;
using System.Collections.Generic;

namespace Arkos.Domain.Entities
{
    public class Place : AuditableEntity
    {
        public Place()
        {
            Invoices = new HashSet<Invoice>();
            Inventory = new HashSet<Inventory>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Invoice> Invoices { get; private set; }
        public ICollection<Inventory> Inventory { get; set; }
    }
}
