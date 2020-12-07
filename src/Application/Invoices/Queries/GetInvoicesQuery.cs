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

namespace Arkos.Application.Invoices.Queries
{
    public class GetInvoicesQuery : IRequest<InvoicesVm>
    {

    }

    public class GetInvoicesQueryHandler : IRequestHandler<GetInvoicesQuery, InvoicesVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetInvoicesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<InvoicesVm> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
        {
            return new InvoicesVm()
            {
                Invoices = await _context.Invoices
                .ProjectTo<InvoiceDto>(_mapper.ConfigurationProvider)
                .OrderBy(t => t.DateInvoice)
                .ToListAsync(cancellationToken)
            };
        }
    }
}
