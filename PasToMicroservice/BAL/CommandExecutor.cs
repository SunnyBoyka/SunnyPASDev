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
            #region v1
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
            #endregion

            #region v2
            //var process = new Process();
            //process.StartInfo.FileName = "/bin/bash";
            //process.StartInfo.Arguments = "-c \"sudo -S " + command + "\"";
            //process.StartInfo.RedirectStandardOutput = true;
            //process.StartInfo.RedirectStandardError = true;
            //process.StartInfo.RedirectStandardInput = true;
            //process.StartInfo.UseShellExecute = false;
            //process.StartInfo.CreateNoWindow = true;

            //process.Start();

            //// Write the sudo password
            //process.StandardInput.WriteLine("customkali");
            //process.StandardInput.Flush();

            //string output = string.Empty;
            //output=process.StandardOutput.ReadToEnd();
            //string error = process.StandardError.ReadToEnd();

            //process.WaitForExit();
            #endregion

            var process = new Process();

            bool isGvmCommand =
                command.Contains("openvas", StringComparison.OrdinalIgnoreCase);

            if (isGvmCommand)
            {
                process.StartInfo.FileName = "/bin/bash";
                process.StartInfo.Arguments = $"-c \"{command}\"";
            }
            else
            {
                process.StartInfo.FileName = "/bin/bash";
                process.StartInfo.Arguments = $"-c \"sudo -S {command}\"";
            }

            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            process.StartInfo.RedirectStandardInput = !isGvmCommand; 
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;

            process.Start();

            // Send sudo password ONLY when sudo is used
            if (!isGvmCommand)
            {
                process.StandardInput.WriteLine("customkali");
                process.StandardInput.Flush();
            }

            string output = process.StandardOutput.ReadToEnd();
            string error = process.StandardError.ReadToEnd();

            process.WaitForExit();

            // Optional logging
            Console.WriteLine(output);
            if (!string.IsNullOrWhiteSpace(error))
                Console.WriteLine($"ERROR: {error}");

            var enumCommands = NmapParser.BuildGvmScanCommand(output);


            return (output, enumCommands);
        }
    }
}
