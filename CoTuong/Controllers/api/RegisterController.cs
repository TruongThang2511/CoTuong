using Libs.Models;
using Libs.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CoTuong.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IRegisterRepository suRepo;

        public RegisterController(IRegisterRepository repo)
        {
            suRepo = repo;
        }

        [HttpPost("signupacc")]
        public async Task<IActionResult> SignUp(RegisterModel signUpModel)
        {
            var result = await suRepo.SignUpAsync(signUpModel);
            if (result.Succeeded)
            {
                return Ok(result.Succeeded);
            }

            return Unauthorized();
        }
    }
}
