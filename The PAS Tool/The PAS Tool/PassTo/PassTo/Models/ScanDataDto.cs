namespace PassTo.Models
{
    public class ScanDataDto
    {
        public long Id { get; set; }
        public string ScanType { get; set; }
        public string Command { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public string ScanStatus { get; set; }
        public string ScanResult { get; set; }
        public int? TriggeredBy { get; set; }
    }
}
