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

namespace Arkos.Application.Inventories.Queries
{
    public class GetInventoriesQuery : IRequest<InventoriesVm>
    {

    }

    public class GetInventoriesQueryHandler : IRequestHandler<GetInventoriesQuery, InventoriesVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetInventoriesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<InventoriesVm> Handle(GetInventoriesQuery request, CancellationToken cancellationToken)
        {
            return new InventoriesVm()
            {
                Inventories = await _context.Inventories
                .ProjectTo<InventoryDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(i=>i.InventoryDate)
                .ToListAsync(cancellationToken)
            };
        }
    }
}
