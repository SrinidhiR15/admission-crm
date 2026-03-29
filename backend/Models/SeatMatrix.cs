namespace backend.Models
{
    public class SeatMatrix
    {
        public int Id { get; set; }
        public int ProgramId { get; set; }
        public ProgramEntity? Program { get; set; }
        public int TotalIntake { get; set; }
        public int KCET { get; set; }
        public int COMEDK { get; set; }
        public int Management { get; set; }
    }
}