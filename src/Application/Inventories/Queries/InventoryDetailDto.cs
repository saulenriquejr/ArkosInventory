using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Application.Inventories.Queries
{
    public class InventoryDetailDto : IMapFrom<InventoryDetail>
    {
        public int Id { get; set; }
        public int InventoryId { get; set; }
        public int ProductId { get; set; }
        public int ManualCount { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal TotalSale { get; set; }
        public Product Product { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<InventoryDetail, InventoryDetailDto>();
        }
    }
}
