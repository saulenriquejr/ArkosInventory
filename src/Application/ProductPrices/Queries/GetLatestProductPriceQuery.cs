using Arkos.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.ProductPrices.Queries
{
	public class GetLatestProductPriceQuery : IRequest<ProductPricesVM>
	{
	}

	public class GetLatestProductPriceQueryHandler : IRequestHandler<GetLatestProductPriceQuery, ProductPricesVM>
	{
		private readonly IApplicationDbContext _context;
		private readonly IMapper _mapper;

		public GetLatestProductPriceQueryHandler(IApplicationDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		class Person
		{
			public string Name { get; set; }
		}

		class Pet
		{
			public string Name { get; set; }
			public Person Owner { get; set; }
		}

		public async Task<ProductPricesVM> Handle(GetLatestProductPriceQuery request, CancellationToken cancellationToken)
		{
			var groupedProductPrice = _context.ProductPrices
				.GroupBy(gpp => new ProductPriceDto { ProductId = gpp.ProductId })
				.Select(spp => new ProductPriceDto { ProductId = spp.Key.ProductId, Created = spp.Max(pp => pp.Created) })
				.OrderBy(obpp => obpp.ProductId)
				.ToList();

			var ProductPrices = _context.ProductPrices.OrderBy(t => t.ProductId).ToList();

			var latestProductPrices = ProductPrices
				.Join(groupedProductPrice,
				pp => new { pp.ProductId, pp.Created },
				gpp => new { gpp.ProductId, gpp.Created },
				(pp, gpp) => new ProductPriceDto
				{
					Id=pp.Id,
					ProductId = gpp.ProductId,
					PlaceId = pp.PlaceId,
					Price = pp.Price,
					Created = pp.Created
				}).ToList();


			return new ProductPricesVM
			{
				ProductPrices = latestProductPrices
			};
		}
	}
}
