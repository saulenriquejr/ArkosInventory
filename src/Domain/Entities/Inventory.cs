using Arkos.Domain.Common;
using System;
using System.Collections.Generic;

namespace Arkos.Domain.Entities
{
    public class Inventory : AuditableEntity
    {
        public Inventory()
        {
            InventoryDetails = new HashSet<InventoryDetail>();
        }
        public int Id { get; set; }
        public DateTime InventoryDate { get; set; }
        public bool IsDraft { get; set; }
        public int PlaceId { get; set; }
        public Place Place { get; set; }
        public decimal TotalSale { get; set; }
        public ICollection<InventoryDetail> InventoryDetails { get; private set; }
    }
}
