using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasToMicroservice.BAL
{
    public interface ICommandExecutor
    {
        public Task<(string output, List<string> enumCommands)> ExecuteCommandAsync(string command, int commandId, int ProjectId, int JobId);
    }
}
