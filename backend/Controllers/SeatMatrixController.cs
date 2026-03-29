using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatMatrixController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeatMatrixController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var items = _context.SeatMatrices
                .Include(x => x.Program)
                .Select(x => new
                {
                    x.Id,
                    x.ProgramId,
                    ProgramName = x.Program.Name,
                    x.TotalIntake,
                    x.KCET,
                    x.COMEDK,
                    x.Management
                })
                .ToList();

            return Ok(items);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var item = _context.SeatMatrices
                .Include(x => x.Program)
                .FirstOrDefault(x => x.Id == id);

            return item == null ? NotFound() : Ok(item);
        }

        [HttpGet("by-program/{programId}")]
        public IActionResult GetByProgram(int programId)
        {
            var item = _context.SeatMatrices
                .Include(x => x.Program)
                .FirstOrDefault(x => x.ProgramId == programId);

            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] SeatMatrix? matrix)
        {
            if (matrix == null)
                return BadRequest("Seat matrix payload is required.");

            if (matrix.ProgramId <= 0)
                return BadRequest("ProgramId is required.");

            if (matrix.KCET + matrix.COMEDK + matrix.Management != matrix.TotalIntake)
                return BadRequest("KCET + COMEDK + Management must equal Total Intake.");

            _context.SeatMatrices.Add(matrix);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = matrix.Id }, matrix);
        }
    }
}
