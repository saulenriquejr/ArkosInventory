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
    public class CreateInvoiceCommand : IRequest<int>
    {
        public DateTime DateInvoice { get; set; }
        public int PlaceId { get; set; }
        public ICollection<CreateInvoiceDetailDto> InvoiceDetails { get; set; }
    }

    public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateInvoiceCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<int> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var placeEntity = await _context.Places.FindAsync(request.PlaceId);
            if (placeEntity == null)
                throw new InvalidEntityKeyException($"The Place {request.PlaceId} doesn't exist");

            var entity = new Invoice()
            {
                DateInvoice = request.DateInvoice,
                PlaceId = request.PlaceId
            };

            foreach (var invoiceDetail in request.InvoiceDetails)
            {
                var invoiceDetailEntity = new InvoiceDetail()
                {
                    Amount = invoiceDetail.Amount,
                    ProductId = invoiceDetail.ProductId
                };

                entity.InvoiceDetails.Add(invoiceDetailEntity);
            }

            _context.Invoices.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
