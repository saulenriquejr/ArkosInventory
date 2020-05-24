using Arkos.Application.Inventories.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Arkos.WebUI.Controllers
{
    [AllowAnonymous]
    public class InventoryController : ApiController
    {
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateInventoryCommand command)
        {
            return await Mediator.Send(command);
        }
    }
}
