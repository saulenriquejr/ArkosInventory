using Arkos.Application.Common.Exceptions;
using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Invoices.Command
{
	public class UpdateInvoiceCommand : IRequest
	{
		public int Id { get; set; }
		public DateTime DateInvoice { get; set; }
		public int PlaceId { get; set; }
		public int ProviderId { get; set; }
	}

	public class UpdateInvoiceCommandHandler : IRequestHandler<UpdateInvoiceCommand>
	{
		private readonly IApplicationDbContext _context;

		public UpdateInvoiceCommandHandler(IApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(UpdateInvoiceCommand request, CancellationToken cancellationToken)
		{
			var entity = await _context.Invoices.FindAsync(request.Id);

			if (entity == null)
			{
				throw new NotFoundException(nameof(Invoice), request.Id);
			}

			entity.DateInvoice = request.DateInvoice;
			entity.PlaceId = request.PlaceId;
			entity.ProviderId = request.ProviderId;

			await _context.SaveChangesAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
