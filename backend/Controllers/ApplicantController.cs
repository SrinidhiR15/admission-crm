using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicantController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicantController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Create(Applicant applicant)
        {
            if (string.IsNullOrWhiteSpace(applicant.Name) || string.IsNullOrWhiteSpace(applicant.Email))
            {
                return BadRequest("Applicant name and email are required.");
            }

            _context.Applicants.Add(applicant);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = applicant.Id }, applicant);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Applicants.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var applicant = _context.Applicants.Find(id);
            return applicant == null ? NotFound() : Ok(applicant);
        }
    }
}