using Arkos.Application.ProductPrices.Command;
using Arkos.Application.ProductPrices.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Arkos.WebUI.Controllers
{
    [Authorize]
    public class ProductPricesController : ApiController
    {
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateProductPriceCommand command)
        {
            return await Mediator.Send(command);
        }

		[HttpGet]
		public async Task<ActionResult<ProductPricesVM>> Get()
		{
			return await Mediator.Send(new GetLatestProductPriceQuery());
		}

		//[HttpPut("{id}")]
		//public async Task<ActionResult> Update(int id, UpdateInvoiceDetailCommand command)
		//{
		//	if (id != command.Id)
		//	{
		//		return BadRequest();
		//	}

		//	await Mediator.Send(command);

		//	return NoContent();
		//}
		//[HttpDelete("{id}")]
		//public async Task<ActionResult> Delete(int id)
		//{
		//	await Mediator.Send(new DeleteInvoiceDetailCommand { Id = id });

		//	return NoContent();
		//}
	}
}
