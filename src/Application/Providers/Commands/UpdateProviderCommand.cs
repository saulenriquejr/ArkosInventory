using Arkos.Application.Common.Exceptions;
using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Providers.Commands
{
    public class UpdateProviderCommand : IRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateProviderCommandHandler : IRequestHandler<UpdateProviderCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateProviderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateProviderCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Providers.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Provider), request.Id);
            }

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
