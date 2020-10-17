using Arkos.Application.Invoices.Command;
using Arkos.Application.Invoices.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Arkos.WebUI.Controllers
{
    [Authorize]
    public class InvoicesController : ApiController
    {
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateInvoiceCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<InvoicesVm>> Get()
        {
            return await Mediator.Send(new GetInvoicesQuery());
        }
    }
}
