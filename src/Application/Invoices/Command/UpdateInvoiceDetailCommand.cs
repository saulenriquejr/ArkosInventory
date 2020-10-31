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
    public class UpdateInvoiceDetailCommand : IRequest
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int ProductId { get; set; }
    }

    public class UpdateInvoiceDetailCommandHandler : IRequestHandler<UpdateInvoiceDetailCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateInvoiceDetailCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

		public async Task<Unit> Handle(UpdateInvoiceDetailCommand request, CancellationToken cancellationToken)
		{
            var entity = await _context.InvoiceDetails.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(InvoiceDetail), request.Id);
            }

            entity.ProductId = request.ProductId;
            entity.Amount = request.Amount;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
		}
	}
}
