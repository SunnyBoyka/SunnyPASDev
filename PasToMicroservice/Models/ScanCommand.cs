using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasToMicroservice.Models
{
    public class ScanCommand
    {
        public int Id { get; set; }
        public string Command { get; set; }
        public string ScanStatus { get; set; }
        public string ScanResult { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public enum ScanStatus
    {
        Pending,
        InProgress,
        Completed,
        Failed
    }
}
