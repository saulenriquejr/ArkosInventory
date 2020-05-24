using Arkos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Arkos.Infrastructure.Persistence.Configurations
{
    public class InvoiceDetailConfiguration : IEntityTypeConfiguration<InvoiceDetail>
    {
        public void Configure(EntityTypeBuilder<InvoiceDetail> builder)
        {
            builder.HasOne(invoiceDetail => invoiceDetail.Invoice)
                .WithMany(invoice => invoice.InvoiceDetails)
                .HasForeignKey(nvoiceDetail => nvoiceDetail.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_InvoiceDetails_Invoices");

            builder.HasOne(invoiceDetail => invoiceDetail.Product)
                .WithMany(product => product.InvoiceDetails)
                .HasForeignKey(invoiceDetail => invoiceDetail.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_InvoiceDetails_Products");
        }
    }
}
