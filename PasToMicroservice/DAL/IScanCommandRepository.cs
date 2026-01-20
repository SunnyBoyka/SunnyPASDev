using PasToMicroservice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasToMicroservice.DAL
{
    public interface IScanCommandRepository
    {
        Task<List<ScanCommand>> GetPendingCommandsAsync();
        Task UpdateStatusAsync(int id, string status);
        Task SaveResultAsync(int id, string result, string status);

        //Added for subcommands
        Task InsertPendingCommandsAsync(List<string> commands, int scanId, int projectId);
    }
}
