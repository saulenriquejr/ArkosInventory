using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Places.Command
{
    public class CreatePlaceCommand : IRequest<int>
    {
        public string Name { get; set; }
    }

    public class CreatePlaceCommandHandler : IRequestHandler<CreatePlaceCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreatePlaceCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreatePlaceCommand request, CancellationToken cancellationToken)
        {
            var entity = new Place() { Name = request.Name };

            _context.Places.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
