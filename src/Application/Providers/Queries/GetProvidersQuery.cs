using Arkos.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Providers.Queries
{
    public class GetProvidersQuery : IRequest<ProvidersVm>
    {
    }

    public class GetProvidersQueryHandler : IRequestHandler<GetProvidersQuery, ProvidersVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetProvidersQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ProvidersVm> Handle(GetProvidersQuery request, CancellationToken cancellationToken)
        {
            return new ProvidersVm()
            {
                Providers = await _context.Providers
                .ProjectTo<ProviderDto>(_mapper.ConfigurationProvider)
                .OrderBy(t => t.Name)
                .ToListAsync(cancellationToken)
            };
        }
    }
}
