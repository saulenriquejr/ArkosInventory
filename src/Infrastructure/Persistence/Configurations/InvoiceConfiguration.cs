using Arkos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Arkos.Infrastructure.Persistence.Configurations
{
    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.HasOne(invoice => invoice.Place)
                .WithMany(place => place.Invoices)
                .HasForeignKey(invoice => invoice.PlaceId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Invoices_Places");
        }
    }
}
