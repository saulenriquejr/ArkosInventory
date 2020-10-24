using Arkos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Arkos.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<TodoList> TodoLists { get; set; }

        DbSet<TodoItem> TodoItems { get; set; }
        DbSet<Place> Places { get; set; }
        DbSet<Product> Products { get; set; }
        DbSet<Invoice> Invoices { get; set; }
        DbSet<InvoiceDetail> InvoiceDetails { get; set; }
        DbSet<Inventory> Inventories { get; set; }
        DbSet<InventoryDetail> InventoryDetails { get; set; }
        DbSet<Provider> Providers { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
