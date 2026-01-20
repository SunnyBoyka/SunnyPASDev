using Microsoft.Extensions.Configuration;
using System.Diagnostics;
using System.Net;
using System.Text.RegularExpressions;

namespace PasToMicroservice.BAL
{
    public class NmapParser
    {
        public static List<string> BuildEnum4LinuxCommands(string nmapOutput)
        {
            var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();
            var commands = new List<string>();

            //// 1. Extract IP address
            //var ipMatch = Regex.Match(nmapOutput, @"Nmap scan report for\s+([0-9\.]+)");
            //if (!ipMatch.Success)
            //    return commands;

            string ipAddress = "testphp.vulnweb.com";// ipMatch.Groups[1].Value;

            // 2. Extract all open ports
            var portMatches = Regex.Matches(
                nmapOutput,
                @"^(\d+)/tcp\s+open",
                RegexOptions.IgnoreCase
            );
            if (portMatches.Count == 0)
            {
                portMatches = Regex.Matches(
                nmapOutput,
                @"(\d+)/tcp\s+open",
                RegexOptions.IgnoreCase
            );
            }

            foreach (Match portMatch in portMatches)
            {
                string port = portMatch.Groups[1].Value;
                string command= string.Empty;
                string tempcommand = @"expect -c '
set timeout 30
log_user 1

set USER admin
set PASS admin
set TARGET_NAME auto-web-target
set TARGET_IP 192.168.74.132
set PORTS ""80,443,9392""

proc auth {} {
  expect {
    -re {Enter username.*} { send ""$::USER\r""; exp_continue }
    -re {Enter password.*} { send ""$::PASS\r"" }
  }
}

# ---------- CREATE TARGET ----------
spawn sudo -u _gvm gvm-cli socket --xml ""<create_target><name>$TARGET_NAME</name><hosts>$TARGET_IP</hosts><port_range>$PORTS</port_range></create_target>""
auth

set TARGET_ID """"

expect {
  -re {id=\""([a-f0-9-]+)\""} {
    set TARGET_ID $expect_out(1,string)
  }
  -re {Target exists already} {
    spawn sudo -u _gvm gvm-cli socket --xml ""<get_targets/>""
    auth
    expect -re {auto-web-target.*id=\""([a-f0-9-]+)\""}
    set TARGET_ID $expect_out(1,string)
  }
}

# ---------- GET SCAN CONFIG ----------
spawn sudo -u _gvm gvm-cli socket --xml ""<get_configs/>""
auth
expect -re {Full and fast.*id=\""([a-f0-9-]+)\""}
set CONFIG_ID $expect_out(1,string)

# ---------- CREATE TASK ----------
spawn sudo -u _gvm gvm-cli socket --xml ""<create_task><name>auto-web-scan</name><config id=\""$CONFIG_ID\""/><target id=\""$TARGET_ID\""/></create_task>""
auth
expect -re {id=\""([a-f0-9-]+)\""}
set TASK_ID $expect_out(1,string)

# ---------- START SCAN ----------
spawn sudo -u _gvm gvm-cli socket --xml ""<start_task task_id=\""$TASK_ID\""/>""
auth
expect eof

puts ""\nScan started successfully""
puts ""Target ID: $TARGET_ID""
puts ""Task ID:   $TASK_ID""
'
";

                if (port == "80")
                {
                    string commander = $"expect command1.exp";
                    var psi = new ProcessStartInfo
                    {
                        FileName = "/bin/bash",
                        Arguments = "-c \"" + commander + "\"",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false
                    };

                    using var process = Process.Start(psi);
                    Console.WriteLine(process.StandardOutput.ReadToEnd());
                    Console.Error.WriteLine(process.StandardError.ReadToEnd());
                    process.WaitForExit();
                    commands.Add(tempcommand);
                }
                #region RequiredCode-TempComment
                //                if (port == "80")
                //                {
                //                    List<string> webTools = [
                //                        /*"sslyze {ipaddress}","sslyze {ipaddress}:{port}","sslyze --certinfo {ipaddress}","sslyze --tlsv1 --tlsv1_1 --tlsv1_2 --tlsv1_3 {ipaddress}",
                //                        "sslyze --sslv2 --sslv3 {ipaddress}","sslyze --regular {ipaddress}","sslyze --low --medium {ipaddress}","sslyze --heartbleed {ipaddress}","sslyze --robot {ipaddress}",
                //                        "sslyze --openssl_ccs {ipaddress}","sslyze --reneg {ipaddress}","sslyze --elliptic_curves {ipaddress}","sslyze --certinfo --ocsp_stapling {ipaddress}",
                //                        "sslyze {ipaddress}","sslyze {ipaddress} --quiet","sslyze --regular --certinfo --heartbleed --robot {ipaddress}","whatweb {ipaddress}:{port}"
                //                        */
                //                        "nmap -p 80,443 -sV --script vuln testphp.vulnweb.com","nmap -p 80,443 -sV --script http-enum,http-methods,http-headers,http-title,http-server-header testphp.vulnweb.com","nmap -p 80,443 -sV --script ","amass enum -active -d testphp.vulnweb.com","nikto -h testphp.vulnweb.com","nikto -h http://testphp.vulnweb.com -Plugins 'apache' http-auth,http-csrf,http-dombased-xss,http-stored-xss,http-shellshock,http-slowloris-check,http-unsafe-output-escaping,http-phpmyadmin-dir-traversal,http-wordpress-enum,http-wordpress-brute testphp.vulnweb.com","sqlmap -u 'http://testphp.vulnweb.com/listproducts.php?cat=1' --dbs --batch","sqlmap -u 'http://testphp.vulnweb.com/listproducts.php?cat=1' -D acuart --tables","sqlmap -u 'http://testphp.vulnweb.com/listproducts.php?cat=1' -D acuart -T artists --dump","sqlmap -u 'http://testphp.vulnweb.com/listproducts.php?cat=1' -D information_schema --tables","sqlmap -u 'http://testphp.vulnweb.com/listproducts.php?cat=1' -D information_schema -T ENGINES --dump","python3 /home/customkali/Desktop/PASToolDevDocs/XSStrike/xsstrike.py -u 'http://testphp.vulnweb.com/search.php?test=query' ","hydra -l test -P /home/customkali/Desktop/PASToolDevDocs/Passwords.txt testphp.vulnweb.com  http-post-form '/userinfo.php:uname=^USER^&pass=^PASS^:S=Logout'","theHarvester -d testphp.vulnweb.com -b all"];

                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }
                //                else if (port == "443")
                //                {
                //                    List<string> webTools = ["sslyze {ipaddress}","sslyze {ipaddress}:{port}","sslyze --certinfo {ipaddress}","sslyze --tlsv1 --tlsv1_1 --tlsv1_2 --tlsv1_3 {ipaddress}",
                //                        "sslyze --sslv2 --sslv3 {ipaddress}","sslyze --regular {ipaddress}","sslyze --low --medium {ipaddress}","sslyze --heartbleed {ipaddress}","sslyze --robot {ipaddress}",
                //                        "sslyze --openssl_ccs {ipaddress}","sslyze --reneg {ipaddress}","sslyze --elliptic_curves {ipaddress}","sslyze --certinfo --ocsp_stapling {ipaddress}",
                //                        "sslyze {ipaddress}","sslyze {ipaddress} --quiet","sslyze --regular --certinfo --heartbleed --robot {ipaddress}","whatweb {ipaddress}:{port}"];

                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }
                //                else if (port == "3306")
                //                {
                //                    List<string> webTools = ["nmap --script=mysql-info {ipaddress}","sqlmap -u 'http://{ipaddress}/page.php?id=1' --dbms=mysql --dbs"
                //];

                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }
                //                else if (port == "25")
                //                {
                //                    List<string> webTools = ["sslyze --starttls smtp {ipaddress}:{port}"];
                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }
                //                else if (port == "21")
                //                {
                //                    List<string> webTools = ["sslyze --starttls smtp {ipaddress}:{port}"];
                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }
                //                else if (port == "143")
                //                {

                //                    List<string> webTools = ["sslyze --starttls smtp {ipaddress}:{port}"];
                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }
                //                else if (port == "3306")
                //                {
                //                    List<string> webTools = ["nmap --script=mysql-info {ipaddress}","sqlmap -u 'http://{ipaddress}/page.php?id=1' --dbms=mysql --dbs"
                //];

                //                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }
                //                else
                //                {
                //                    List<string> webTools = ["onesixtyone -d {ipaddress}", "enum4linux -a -u \"Jon\" -p \"Qwerty@123\" {ipaddress} --port {port}"];                    for (int i = 0; i < webTools.Count; i++)
                //                    {
                //                        command = webTools[i].Replace("{ipaddress}", ipAddress).Replace("{port}", port);
                //                        commands.Add(command);
                //                    }
                //                }


                #endregion
                //string port = portMatch.Groups[1].Value;

                //// Check if port exists in configuration
                //if (configuration.GetSection($"Ports:{port}").Exists())
                //{
                //    // Get tools for this port
                //    var toolsSection = configuration.GetSection($"Ports:{port}:Tools");
                //    var tools = toolsSection.GetChildren().Select(x => x.Value).ToList();

                //    if (tools != null && tools.Any())
                //    {
                //        foreach (string tool in tools)
                //        {
                //            string command = tool.ToLower() switch
                //            {
                //                "sqlmap" => $"sqlmap -u http://{ipAddress}:{port} --batch --risk=3 --level=5",
                //                "sslyze" => $"sslyze --regular {ipAddress}:{port}",
                //                "enum4linux" => $"enum4linux -a -u \"Jon\" -p \"Qwerty@123\" {ipAddress} --port {port}",
                //                _ => $"{tool} {ipAddress}:{port}"
                //            };
                //            commands.Add(command);
                //        }
                //    }
                //}
                //else
                //{
                //    // Default behavior if port not in config
                //    string command = $"enum4linux -a -u \"Jon\" -p \"Qwerty@123\" {ipAddress} --port {port}";
                //    commands.Add(command);
                //}
            }
            return commands;
        }
    }
}