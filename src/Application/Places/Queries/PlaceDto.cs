using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;

namespace Arkos.Application.Places.Queries
{
    public class PlaceDto : IMapFrom<Place>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}