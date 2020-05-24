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

namespace Arkos.Application.Places.Queries
{
    public class GetPlacesQuery : IRequest<PlacesVm>
    {

    }

    public class GetPlacesQueryHandler : IRequestHandler<GetPlacesQuery, PlacesVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPlacesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PlacesVm> Handle(GetPlacesQuery request, CancellationToken cancellationToken)
        {
            return new PlacesVm()
            {
                Places = await _context.Places
                .ProjectTo<PlaceDto>(_mapper.ConfigurationProvider)
                .OrderBy(t => t.Name)
                .ToListAsync(cancellationToken)
            };
        }
    }
}
