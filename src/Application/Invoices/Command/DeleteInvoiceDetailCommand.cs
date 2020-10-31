using Arkos.Application.Common.Exceptions;
using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Invoices.Command
{
    public class DeleteInvoiceDetailCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteInvoiceDetailCommandHandler : IRequestHandler<DeleteInvoiceDetailCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteInvoiceDetailCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteInvoiceDetailCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.InvoiceDetails
                .Where(l => l.Id == request.Id)
                .SingleOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                throw new NotFoundException(nameof(InvoiceDetail), request.Id);
            }

            _context.InvoiceDetails.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
