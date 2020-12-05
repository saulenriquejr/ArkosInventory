using Arkos.Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Arkos.Domain.Entities;
using Arkos.Application.Common.Exceptions;

namespace Arkos.Application.Inventories.Command
{
    public class CreateInventoryCommand : IRequest<int>
    {
        public DateTime InventoryDate { get; set; }
        public bool IsDraft { get; set; }
        public int PlaceId { get; set; }
        public ICollection<CreateInventoryDetailDto> InventoryDetails { get; set; }
    }

    public class CreateInventoryCommandHandler : IRequestHandler<CreateInventoryCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateInventoryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateInventoryCommand request, CancellationToken cancellationToken)
        {
            var placeEntity = await _context.Places.FindAsync(request.PlaceId);
            if (placeEntity == null)
                throw new InvalidEntityKeyException($"The Place {request.PlaceId} doesn't exist");

            var entity = new Inventory()
            {
                InventoryDate = request.InventoryDate,
                IsDraft = request.IsDraft,
                PlaceId = request.PlaceId
            };

            _context.Inventories.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
