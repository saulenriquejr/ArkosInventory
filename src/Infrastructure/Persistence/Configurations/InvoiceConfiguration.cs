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
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Invoices_Places");

            builder.HasOne(invoice => invoice.Provider)
                .WithMany(provider => provider.Invoices)
                .HasForeignKey(invoice => invoice.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Invoices_Providers");
        }
    }
}
