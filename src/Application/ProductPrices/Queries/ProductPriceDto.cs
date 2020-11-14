using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Application.ProductPrices.Queries
{
	public class ProductPriceDto : IMapFrom<ProductPrice>
	{
		public ProductPriceDto()
		{

		}
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public int ProductId { get; set; }
		public int PlaceId { get; set; }
		public decimal Price { get; set; }

		public void Mapping(Profile profile)
		{
			profile.CreateMap<ProductPrice, ProductPriceDto>();
			profile.CreateMap<ProductPriceDto, ProductPriceDto>();
		}
	}
}
