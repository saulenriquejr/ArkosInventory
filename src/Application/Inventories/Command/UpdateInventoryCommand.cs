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
	public class UpdateInventoryCommand : IRequest
	{
		public int Id { get; set; }
		public DateTime InventoryDate { get; set; }
		public int PlaceId { get; set; }
	}

	public class UpdateInventoryCommandHandler : IRequestHandler<UpdateInventoryCommand>
	{
		private readonly IApplicationDbContext _context;

		public UpdateInventoryCommandHandler(IApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(UpdateInventoryCommand request, CancellationToken cancellationToken)
		{
			var entity = await _context.Inventories.FindAsync(request.Id);

			if (entity == null)
			{
				throw new NotFoundException(nameof(Inventory), request.Id);
			}

			entity.InventoryDate = request.InventoryDate;
			entity.PlaceId = request.PlaceId;

			await _context.SaveChangesAsync(cancellationToken);

			return Unit.Value;
		}
	}

}
