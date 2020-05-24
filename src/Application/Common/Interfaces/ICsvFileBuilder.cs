using Arkos.Application.TodoLists.Queries.ExportTodos;
using System.Collections.Generic;

namespace Arkos.Application.Common.Interfaces
{
    public interface ICsvFileBuilder
    {
        byte[] BuildTodoItemsFile(IEnumerable<TodoItemRecord> records);
    }
}
