using Arkos.Application.Common.Exceptions;
using Arkos.Application.Common.Interfaces;
using Arkos.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Inventories.Command
{
    public class DeleteInventoryDetailCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteInventoryDetailCommandHandler : IRequestHandler<DeleteInventoryDetailCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteInventoryDetailCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteInventoryDetailCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.InventoryDetails
                .Where(l => l.Id == request.Id)
                .SingleOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                throw new NotFoundException(nameof(InventoryDetail), request.Id);
            }

            _context.InventoryDetails.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
