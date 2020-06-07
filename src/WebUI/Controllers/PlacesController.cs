using System.Threading.Tasks;
using Arkos.Application.Places.Command;
using Arkos.Application.Places.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Arkos.WebUI.Controllers
{
    [Authorize]
    public class PlacesController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<PlacesVm>> Get()
        {
            return await Mediator.Send(new GetPlacesQuery());
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreatePlaceCommand command)
        {
            return await Mediator.Send(command);
        }
    }
}