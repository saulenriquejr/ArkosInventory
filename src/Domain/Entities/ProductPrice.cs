using Arkos.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Domain.Entities
{
	public class ProductPrice : AuditableEntity
	{
		public int Id { get; set; }
		public int ProductId { get; set; }
		public Product Product { get; set; }
		public int PlaceId { get; set; }
		public Place Place { get; set; }
		public decimal Price { get; set; }
	}
}
