using CoTuong.Hubs;
using CoTuong.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace CoTuong.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChessController : ControllerBase
    {
        private IWebHostEnvironment webHostEnvironment;
        private IHubContext<ChatHub> hubContext;

        public ChessController(IWebHostEnvironment webHostEnvironment, IHubContext<ChatHub> hubContext)
        {
            this.webHostEnvironment = webHostEnvironment;
            this.hubContext = hubContext;
        }
        [HttpGet]
        [Route("loadChessBoard")]
        public IActionResult getChessBoard()
        {

            string contentRootPath = webHostEnvironment.ContentRootPath;
            string chessJson = System.IO.File.ReadAllText(contentRootPath + "\\Data\\ChessJson.txt");
            List<ChessNode> chessNode = JsonSerializer.Deserialize<List<ChessNode>>(chessJson);
            List<List<PointModel>> maxtrix = new List<List<PointModel>>();
            for (int i = 0; i <= 9; i++)
            {
                int top = 2 + i * 71;
                List<PointModel> points = new List<PointModel>();
                for (int j = 0; j <= 8; j++)
                {
                    int left = 2 + j * 71;
                    PointModel point = new PointModel();
                    point.top = top;
                    point.left = left;
                    point.id = "";
                    ChessNode chess = chessNode.Where(s => s.top == top && s.left == left).FirstOrDefault();
                    if (chess != null)
                    {
                        point.id = chess.id;
                    }
                    points.Add(point);
                }
                maxtrix.Add(points);
            }


            return Ok(new { status = true, message = "", maxtrix = maxtrix, chessNode = chessNode });
        }
        [HttpPost]
        [Route("move-check-node")]
        public IActionResult chessMove(List<MoveChess> movenodeList)
        {
            hubContext.Clients.All.SendAsync("ReceiveChessMove", JsonSerializer.Serialize(movenodeList));
            return Ok(new { status = true, message = "" });
        }
    }
}
