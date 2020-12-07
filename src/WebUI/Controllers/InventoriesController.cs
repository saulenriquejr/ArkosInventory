using Arkos.Application.Inventories.Command;
using Arkos.Application.Inventories.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Arkos.WebUI.Controllers
{
    [AllowAnonymous]
    public class InventoriesController : ApiController
    {
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateInventoryCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<InventoriesVm>> Get()
        {
            return await Mediator.Send(new GetInventoriesQuery());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateInventoryCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await Mediator.Send(new DeleteInventoryCommand { Id = id });

            return NoContent();
        }
    }
}
