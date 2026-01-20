using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasToMicroservice.BAL
{
    public interface ICommandExecutor
    {
        (string output, List<string> enumCommands) ExecuteCommand(string command,int commandId);
    }
}
