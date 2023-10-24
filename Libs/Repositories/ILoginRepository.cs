using Libs.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Libs.Repositories.LoginRepository;

namespace Libs.Repositories
{
    public interface ILoginRepository
    {
        public Task<AuthResult> AuthenAsync(LoginModel model);
    }
}
