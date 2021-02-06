using Arkos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Arkos.Infrastructure.Persistence.Configurations
{
    public class InventoryConfiguration : IEntityTypeConfiguration<Inventory>
    {
        public void Configure(EntityTypeBuilder<Inventory> builder)
        {
            builder.HasOne(inventory => inventory.Place)
                .WithMany(place => place.Inventory)
                .HasForeignKey(inventory => inventory.PlaceId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Inventories_Places");

            builder.Property(pp => pp.TotalSale)
                .IsRequired();

            builder.Property(pp => pp.TotalSale)
                .HasColumnType("Money");
        }
    }
}
