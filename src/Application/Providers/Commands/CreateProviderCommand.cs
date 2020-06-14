using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Providers.Commands
{
    public class CreateProviderCommand : IRequest<int>
    {
        public string Name { get; set; }
    }

    public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateProviderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateProviderCommand request, CancellationToken cancellationToken)
        {
            var entity = new Provider() { Name = request.Name };

            _context.Providers.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
