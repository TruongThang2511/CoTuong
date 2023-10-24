using Libs.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Libs.Repositories
{
    public interface IRegisterRepository
    {
        public Task<IdentityResult> SignUpAsync(RegisterModel model);
    }
}
