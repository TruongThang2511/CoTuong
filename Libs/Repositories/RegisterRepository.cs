using Libs.Entity;
using Libs.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Libs.Repositories
{
    public class RegisterRepository : IRegisterRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration configuration;

        public RegisterRepository(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
        }

        public async Task<IdentityResult> SignUpAsync(RegisterModel model)
        {
            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.UserName
            };

            if (user.Email!.ToLower().StartsWith("admin"))
            {
                await _userManager.CreateAsync(user, model.Password);
                return await _userManager.AddToRoleAsync(user, "ADMIN");
            }
            else
            {
                await _userManager.CreateAsync(user, model.Password);
                return await _userManager.AddToRoleAsync(user, "User");
            }
        }
    }
}
