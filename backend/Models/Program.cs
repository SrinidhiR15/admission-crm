using System.Collections.Generic;

namespace backend.Models
{
    public class ProgramEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<SeatMatrix> SeatMatrices { get; set; } = new List<SeatMatrix>();
        public ICollection<Admission> Admissions { get; set; } = new List<Admission>();
    }
}