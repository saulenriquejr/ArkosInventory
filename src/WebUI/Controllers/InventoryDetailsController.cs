using Arkos.Application.Inventories.Command;
using Arkos.Application.Invoices.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Arkos.WebUI.Controllers
{
	[Authorize]
	public class InventoryDetailsController : ApiController
	{
		[HttpPost]
		public async Task<ActionResult<int>> Create(CreateInventoryDetailCommand command)
		{
			return await Mediator.Send(command);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult> Update(int id, UpdateInventoryDetailCommand command)
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
			await Mediator.Send(new DeleteInventoryDetailCommand { Id = id });

			return NoContent();
		}
	}
}
