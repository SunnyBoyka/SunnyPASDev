using System.Text.RegularExpressions;

namespace PasToMicroservice.BAL
{
    public class NmapParser
    {
        public static List<string> BuildEnum4LinuxCommands(string nmapOutput)
        {
            var commands = new List<string>();

            // 1. Extract IP address
            var ipMatch = Regex.Match(nmapOutput, @"Nmap scan report for\s+([0-9\.]+)");
            if (!ipMatch.Success)
                return commands;

            string ipAddress = ipMatch.Groups[1].Value;

            // 2. Extract all open ports
            var portMatches = Regex.Matches(
                nmapOutput,
                @"^(\d+)/tcp\s+open",
                RegexOptions.IgnoreCase
            );

            foreach (Match portMatch in portMatches)
            {
                string port = portMatch.Groups[1].Value;

                // 3. Build enum4linux command
                string command =
                    $"enum4linux -a -u \"Jon\" -p \"Qwerty@123\" {ipAddress} --port {port}";
                commands.Add(command);
            }

            return commands;
        }
    }
}