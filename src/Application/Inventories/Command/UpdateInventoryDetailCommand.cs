using Arkos.Application.Common.Exceptions;
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
	public class UpdateInventoryDetailCommand : IRequest
	{
		public int Id { get; set; }
		public int ManualCount { get; set; }
		public int ProductId { get; set; }
		public decimal CurrentPrice { get; set; }
		public decimal TotalSale { get; set; }
	}

	public class UpdateInventoryDetailCommandHandler : IRequestHandler<UpdateInventoryDetailCommand>
	{
		private readonly IApplicationDbContext _context;

		public UpdateInventoryDetailCommandHandler(IApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(UpdateInventoryDetailCommand request, CancellationToken cancellationToken)
		{
			var entity = await _context.InventoryDetails.FindAsync(request.Id);

			if (entity == null)
			{
				throw new NotFoundException(nameof(InventoryDetail), request.Id);
			}

			var entityInv = await _context.Inventories.FindAsync(entity.InventoryId);

			if (entityInv == null)
			{
				throw new NotFoundException(nameof(Inventory), entity.InventoryId);
			}

			entityInv.TotalSale -= entity.TotalSale;

			entity.ProductId = request.ProductId;
			entity.ManualCount = request.ManualCount;
			entity.CurrentPrice = request.CurrentPrice;
			entity.TotalSale = request.TotalSale;

			entityInv.TotalSale += entity.TotalSale;

			await _context.SaveChangesAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
