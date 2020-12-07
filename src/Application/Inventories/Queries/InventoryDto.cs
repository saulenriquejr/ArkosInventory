using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Application.Inventories.Queries
{
	public class InventoryDto : IMapFrom<Inventory>
	{
		public InventoryDto()
		{
			InventoryDetails = new List<InventoryDetailDto>();
		}
		public int Id { get; set; }
		public DateTime InventoryDate { get; set; }
		public Place Place { get; set; }
		public IList<InventoryDetailDto> InventoryDetails { get; set; }
	}
}
