using Arkos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Arkos.Infrastructure.Persistence.Configurations
{
    public class InventoryDetailConfiguration : IEntityTypeConfiguration<InventoryDetail>
    {
        public void Configure(EntityTypeBuilder<InventoryDetail> builder)
        {
            builder.HasOne(inventoryDetail => inventoryDetail.Product)
                .WithMany(product => product.InventoryDetails)
                .HasForeignKey(inventoryDetail => inventoryDetail.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_InventoryDetails_Products");

            builder.Property(inventoryDetail => inventoryDetail.TotalSale)
                .HasColumnType("money");

            builder.Property(inventoryDetail => inventoryDetail.CurrentPrice)
                .HasColumnType("money");

        }
    }
}