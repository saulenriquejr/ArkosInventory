using Arkos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Infrastructure.Persistence.Configurations
{
	public class ProductPriceConfiguration : IEntityTypeConfiguration<ProductPrice>
	{
		public void Configure(EntityTypeBuilder<ProductPrice> builder)
		{
			builder.HasOne(productPrice => productPrice.Product)
				.WithMany(product => product.ProductPrices)
				.HasForeignKey(productPrice => productPrice.ProductId)
				.OnDelete(DeleteBehavior.Cascade)
				.HasConstraintName("FK_ProductPrice_Product");

			builder.HasOne(productPrice => productPrice.Place)
				.WithMany(place => place.ProductPrices)
				.HasForeignKey(productPrice => productPrice.PlaceId)
				.OnDelete(DeleteBehavior.Cascade)
				.HasConstraintName("FK_ProductPrice_Place");

			builder.Property(pp => pp.PlaceId)
				.IsRequired();

			builder.Property(pp => pp.Price)
				.IsRequired();

			builder.Property(pp => pp.Price)
				.HasColumnType("Money");
		}
	}
}
