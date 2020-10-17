using Arkos.Application.Common.Mappings;
using Arkos.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Application.Invoices.Queries
{
    public class InvoiceDetailDto : IMapFrom<InvoiceDetail>
    {
        public int Amount { get; set; }
        public int ProductId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<InvoiceDetail, InvoiceDetailDto>();
        }
    }
}
