using CoTuong.Models;
using Libs.Entity;
using Libs.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CoTuong.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger,ChessService chessService)
        {
            _logger = logger;
            //tạo room
            //chessService.InsertRoom(new Room() { id = Guid.NewGuid(), Name = "Room 1" });
            //danh sách room
            //List<Room> roomList = chessService.getRoomList();
            int x = 0;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}