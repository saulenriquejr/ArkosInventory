using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.ProductPrices
{
	public class CreateProductPriceCommand : IRequest<int>
	{
		public int PlaceId { get; set; }
		public int ProductId { get; set; }
		public decimal Price { get; set; }
	}

	public class CreateProductPriceCommandHandler : IRequestHandler<CreateProductPriceCommand, int>
	{
		private readonly IApplicationDbContext _context;

		public CreateProductPriceCommandHandler(IApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<int> Handle(CreateProductPriceCommand request, CancellationToken cancellationToken)
		{
			var entity = new ProductPrice
			{
				PlaceId = request.PlaceId,
				ProductId = request.ProductId,
				Price = request.Price
			};

			_context.ProductPrices.Add(entity);

			await _context.SaveChangesAsync(cancellationToken);

			return entity.Id;
		}
	}

}
