using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;

namespace Arkos.Application.Products.Queries
{
    public class ProductDto : IMapFrom<Product>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
