using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgramController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProgramController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Create(ProgramEntity program)
        {
            if (string.IsNullOrWhiteSpace(program.Name))
            {
                return BadRequest("Program name is required.");
            }

            _context.Programs.Add(program);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = program.Id }, program);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Programs.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var program = _context.Programs.Find(id);
            return program == null ? NotFound() : Ok(program);
        }
    }
}