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
    public class CreateInvoiceDetailCommand : IRequest<int>
    {
        public int InvoiceId { get; set; }
        public int ProductId { get; set; }
        public int Amount { get; set; }
    }

    public class CreateTodoItemCommandHandler : IRequestHandler<CreateInvoiceDetailCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateTodoItemCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateInvoiceDetailCommand request, CancellationToken cancellationToken)
        {
            var entity = new InvoiceDetail
            {
                InvoiceId=request.InvoiceId,
                ProductId = request.ProductId,
                Amount = request.Amount
            };

            _context.InvoiceDetails.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
