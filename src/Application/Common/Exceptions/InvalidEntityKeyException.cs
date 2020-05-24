using System;
using System.Collections.Generic;
using System.Text;

namespace Arkos.Application.Common.Exceptions
{
    public class InvalidEntityKeyException : Exception
    {
        public InvalidEntityKeyException() : base()
        {

        }

        public InvalidEntityKeyException(string message) : base(message)
        {
        }
    }
}
