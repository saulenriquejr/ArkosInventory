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
    public class InvoiceDetailsController : ApiController
    {
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateInvoiceDetailCommand command)
        {
            return await Mediator.Send(command);
        }

		//[HttpGet]
		//public async Task<ActionResult<InvoicesVm>> Get()
		//{
		//    return await Mediator.Send(new GetInvoicesQuery());
		//}

		[HttpPut("{id}")]
		public async Task<ActionResult> Update(int id, UpdateInvoiceDetailCommand command)
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
			await Mediator.Send(new DeleteInvoiceDetailCommand { Id = id });

			return NoContent();
		}
	}
}
