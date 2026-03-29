using System.Collections.Generic;

namespace backend.Models
{
    public class Applicant
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string EntryType { get; set; } = string.Empty;
        public string QuotaType { get; set; } = string.Empty;
        public int Marks { get; set; }
        public string DocumentStatus { get; set; } = string.Empty;

        public ICollection<Admission> Admissions { get; set; } = new List<Admission>();
    }
}