using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdmissionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdmissionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var admissions = _context.Admissions
                .Include(a => a.Applicant)
                .Include(a => a.Program)
                .Select(a => new
                {
                    a.Id,
                    a.AdmissionNumber,
                    a.QuotaType,
                    a.FeeStatus,
                    a.IsConfirmed,
                    ApplicantName = a.Applicant.Name,
                    ProgramName = a.Program.Name
                })
                .ToList();

            return Ok(admissions);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var admission = _context.Admissions
                .Include(a => a.Applicant)
                .Include(a => a.Program)
                .FirstOrDefault(a => a.Id == id);

            if (admission == null)
                return NotFound();

            return Ok(new
            {
                admission.Id,
                admission.ApplicantId,
                ApplicantName = admission.Applicant.Name,
                admission.ProgramId,
                ProgramName = admission.Program.Name,
                admission.QuotaType,
                admission.AdmissionNumber,
                admission.FeeStatus,
                admission.IsConfirmed
            });
        }

        [HttpPost("allocate")]
        public IActionResult Allocate([FromBody] AdmissionRequest request)
        {
            if (request == null)
                return BadRequest("Invalid allocation request.");

            var applicant = _context.Applicants.Find(request.ApplicantId);
            if (applicant == null)
                return BadRequest("Applicant not found.");

            var program = _context.Programs.Find(request.ProgramId);
            if (program == null)
                return BadRequest("Program not found.");

            if (!IsSeatAvailable(request.ProgramId, request.QuotaType))
                return BadRequest("Quota is full.");

            var admission = new Admission
            {
                ApplicantId = request.ApplicantId,
                ProgramId = request.ProgramId,
                QuotaType = request.QuotaType,
                AdmissionNumber = GenerateAdmissionNumber(program.Name, request.QuotaType),
                FeeStatus = "Pending",
                IsConfirmed = false
            };

            _context.Admissions.Add(admission);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = admission.Id }, new
            {
                admission.Id,
                admission.ApplicantId,
                admission.ProgramId,
                admission.QuotaType,
                admission.AdmissionNumber,
                admission.FeeStatus,
                admission.IsConfirmed
            });
        }

        [HttpPost("mark-fee-paid/{id}")]
        public IActionResult MarkFeePaid(int id)
        {
            var admission = _context.Admissions.Find(id);
            if (admission == null)
                return NotFound();

            if (admission.IsConfirmed)
                return BadRequest("Admission is already confirmed.");

            admission.FeeStatus = "Paid";
            _context.SaveChanges();

            return Ok(new
            {
                admission.Id,
                admission.ApplicantId,
                admission.ProgramId,
                admission.QuotaType,
                admission.AdmissionNumber,
                admission.FeeStatus,
                admission.IsConfirmed
            });
        }

        [HttpPost("confirm/{id}")]
        public IActionResult Confirm(int id)
        {
            var admission = _context.Admissions.Find(id);
            if (admission == null)
                return NotFound();

            if (admission.FeeStatus != "Paid")
                return BadRequest("Fee must be paid before confirming admission.");

            admission.IsConfirmed = true;
            _context.SaveChanges();

            return Ok(new
            {
                admission.Id,
                admission.ApplicantId,
                admission.ProgramId,
                admission.QuotaType,
                admission.AdmissionNumber,
                admission.FeeStatus,
                admission.IsConfirmed
            });
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            var total = _context.SeatMatrices.Sum(x => (int?)x.TotalIntake) ?? 0;
            var admitted = _context.Admissions.Count();
            var remaining = total - admitted;

            var quotaStats = new[]
            {
                new {
                    quota = "KCET",
                    total = _context.SeatMatrices.Sum(x => (int?)x.KCET) ?? 0,
                    filled = _context.Admissions.Count(a => a.QuotaType == "KCET")
                },
                new {
                    quota = "COMEDK",
                    total = _context.SeatMatrices.Sum(x => (int?)x.COMEDK) ?? 0,
                    filled = _context.Admissions.Count(a => a.QuotaType == "COMEDK")
                },
                new {
                    quota = "Management",
                    total = _context.SeatMatrices.Sum(x => (int?)x.Management) ?? 0,
                    filled = _context.Admissions.Count(a => a.QuotaType == "Management")
                }
            };

            var pendingDocs = _context.Applicants
                .Where(a => a.DocumentStatus != "Verified")
                .Select(a => new { a.Id, a.Name, a.DocumentStatus })
                .ToList();

            var feePending = _context.Admissions
                .Include(a => a.Applicant)
                .Include(a => a.Program)
                .Where(a => a.FeeStatus != "Paid")
                .Select(a => new { a.Id, ApplicantName = a.Applicant.Name, ProgramName = a.Program.Name })
                .ToList();

            return Ok(new
            {
                total,
                admitted,
                remaining,
                quotaStats,
                pendingDocs,
                feePending
            });
        }

        private bool IsSeatAvailable(int programId, string quota)
        {
            var seats = _context.SeatMatrices.FirstOrDefault(x => x.ProgramId == programId);
            if (seats == null) return false;

            int used = _context.Admissions.Count(a => a.ProgramId == programId && a.QuotaType == quota);

            int total = quota switch
            {
                "KCET" => seats.KCET,
                "COMEDK" => seats.COMEDK,
                "Management" => seats.Management,
                _ => 0
            };

            return used < total;
        }

        private string GenerateAdmissionNumber(string program, string quota)
        {
            int count = _context.Admissions.Count() + 1;
            var normalizedProgram = string.IsNullOrWhiteSpace(program)
                ? "GEN"
                : program.Replace(" ", string.Empty).ToUpper();
            return $"INST/2026/UG/{normalizedProgram}/{quota}/{count:D4}";
        }
    }
}
