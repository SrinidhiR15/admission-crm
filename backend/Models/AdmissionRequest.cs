namespace backend.Models
{
    public class AdmissionRequest
    {
        public int ApplicantId { get; set; }
        public int ProgramId { get; set; }
        public string QuotaType { get; set; } = string.Empty;
    }
}
