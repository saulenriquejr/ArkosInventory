using Arkos.Application.Common.Interfaces;
using System;

namespace Arkos.Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.Now;
    }
}
