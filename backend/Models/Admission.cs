namespace backend.Models
{
    public class Admission
    {
        public int Id { get; set; }
        public int ApplicantId { get; set; }
        public Applicant Applicant { get; set; } = null!;
        public int ProgramId { get; set; }
        public ProgramEntity Program { get; set; } = null!;
        public string QuotaType { get; set; } = string.Empty;
        public string AdmissionNumber { get; set; } = string.Empty;
        public string FeeStatus { get; set; } = string.Empty;
        public bool IsConfirmed { get; set; }
    }
}