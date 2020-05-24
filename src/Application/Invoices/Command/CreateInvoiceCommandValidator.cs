using FluentValidation;

namespace Arkos.Application.Invoices.Command
{
    public class CreateInvoiceCommandValidator : AbstractValidator<CreateInvoiceCommand>
    {
        public CreateInvoiceCommandValidator()
        {
            RuleFor(v => v.DateInvoice)
                .NotEmpty();

            RuleFor(v => v.PlaceId)
                .NotEmpty();
        }
    }
}
