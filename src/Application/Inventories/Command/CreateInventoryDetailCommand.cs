using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Inventories.Command
{
	public class CreateInventoryDetailCommand : IRequest<int>
	{
		public int InventoryId { get; set; }
		public int ProductId { get; set; }
		public int ManualCount { get; set; }
		public decimal CurrentPrice { get; set; }
		public decimal TotalSale { get; set; }
	}

	public class CreateInventoryDetailCommandHandler : IRequestHandler<CreateInventoryDetailCommand, int>
	{
		private readonly IApplicationDbContext _context;

		public CreateInventoryDetailCommandHandler(IApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<int> Handle(CreateInventoryDetailCommand request, CancellationToken cancellationToken)
		{
			var entity = new InventoryDetail
			{
				InventoryId = request.InventoryId,
				ProductId = request.ProductId,
				ManualCount = request.ManualCount,
				CurrentPrice = request.CurrentPrice,
				TotalSale = request.TotalSale
			};

			_context.InventoryDetails.Add(entity);

			await _context.SaveChangesAsync(cancellationToken);

			return entity.Id;
		}
	}
}
