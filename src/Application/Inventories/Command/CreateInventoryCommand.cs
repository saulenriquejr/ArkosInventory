using Arkos.Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Arkos.Domain.Entities;

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
            var entity = new Inventory()
            {
                InventoryDate = request.InventoryDate,
                IsDraft = request.IsDraft,
                PlaceId = request.PlaceId
            };

            foreach (var inventoryDetail in request.InventoryDetails)
            {
                var inventoryDetailEntity = new InventoryDetail()
                {
                    CurrentPrice = inventoryDetail.CurrentPrice,
                    ManualCount = inventoryDetail.ManualCount,
                    ProductId = inventoryDetail.ProductId,
                    TotalSale = inventoryDetail.TotalSale
                };

                entity.InventoryDetails.Add(inventoryDetailEntity);
            }

            _context.Inventories.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
