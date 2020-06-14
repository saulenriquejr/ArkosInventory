using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;

namespace Arkos.Application.Providers.Queries
{
    public class ProviderDto : IMapFrom<Provider>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}