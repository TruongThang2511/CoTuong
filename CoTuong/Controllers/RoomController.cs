using CoTuong.CachesManage;
using Libs.Entity;
using Libs.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace CoTuong.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private ChessService chessService;
        private IMemoryCache memoryCache;
        private CacheService cacheService;
        private CacheManage cacheManage;

        public RoomController(ChessService chessService, IMemoryCache memoryCache, CacheService cacheService, )
        {
            this.chessService = chessService;
            this.memoryCache = memoryCache;
            this.cacheService = cacheService;
            this.cacheManage = new CacheManage(chessService, memoryCache);
        }
        [HttpPost]
        [Route("insertRoom")]
        public IActionResult insertRoom(string roomName)
        {
            chessService.InsertRoom(new Room() { id = Guid.NewGuid(), Name = roomName });
            return Ok(new {status = true, message=""});
        }
        [HttpGet]
        [Route("getRoom")]
        public IActionResult getRoom()
        {
            List<Room> roomList = chessService.getRoomList();
            return Ok(new { status = true, message = "" ,data = roomList});
        }
    }
}
