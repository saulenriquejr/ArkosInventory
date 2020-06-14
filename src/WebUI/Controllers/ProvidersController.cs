using Arkos.Application.Providers.Commands;
using Arkos.Application.Providers.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Arkos.WebUI.Controllers
{
    [Authorize]
    public class ProvidersController : ApiController
    {
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateProviderCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<ProvidersVm>> Get()
        {
            return await Mediator.Send(new GetProvidersQuery());
        }

        [HttpPut("[action]")]
        public async Task<ActionResult> Update(int id, UpdateProviderCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await Mediator.Send(command);

            return NoContent();
        }
    }
}
