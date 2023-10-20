using Microsoft.AspNetCore.Mvc;

namespace CoTuong.Controllers
{
    public class RoomsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
