using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasToMicroservice.BAL
{
    public class CommandExecutor : ICommandExecutor
    {
        public (string output, List<string> enumCommands) ExecuteCommand(string command,int commandId)
        {
            //var process = new Process();
            //process.StartInfo.FileName = "/bin/bash";
            //process.StartInfo.Arguments = $"-c \"{command}\"";
            //process.StartInfo.RedirectStandardOutput = true;
            //process.StartInfo.RedirectStandardError = true;
            //process.StartInfo.UseShellExecute = false;
            //process.StartInfo.CreateNoWindow = true;

            //process.Start();

            //string output = process.StandardOutput.ReadToEnd();
            //string error = process.StandardError.ReadToEnd();

            //process.WaitForExit();

            //return output + "\n" + error;

            var process = new Process();
            process.StartInfo.FileName = "/bin/bash";
            process.StartInfo.Arguments = "-c \"sudo -S " + command + "\"";
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            process.StartInfo.RedirectStandardInput = true;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;

            process.Start();

            // Write the sudo password
            process.StandardInput.WriteLine("customkali");
            process.StandardInput.Flush();

            string output = string.Empty;
            output=process.StandardOutput.ReadToEnd();
            string error = process.StandardError.ReadToEnd();

            process.WaitForExit();

            var enumCommands = NmapParser.BuildCommands(output);


            return (output, enumCommands);
        }
    }
}
