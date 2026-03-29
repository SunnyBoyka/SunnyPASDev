using Microsoft.Extensions.Configuration;
using PasToMicroservice.DAL;
using PasToMicroservice.Models;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text.RegularExpressions;

namespace PasToMicroservice.BAL
{
    public class ScanService
    {
        private readonly IScanCommandRepository _scanCommandRepo;

        public ScanService(IScanCommandRepository scanCommandRepo)
        {
            _scanCommandRepo = scanCommandRepo;
        }

        #region BuildCommands Old
        public static List<string> BuildCommands(string nmapOutput)
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


        #endregion


        public async Task<List<string>> BuildGvmScanCommand(string nmapOutput, int commandId, int ProjectId, int JobId, string targetName = "auto-web-target", string username = "admin", string password = "admin")
        {
            var commands = new List<string>();

            // 1. Extract IP address
            var ipMatch = Regex.Match(nmapOutput, @"Nmap scan report for\s+([0-9\.]+)");
            if (!ipMatch.Success)
                return commands;

            string ipAddress = ipMatch.Groups[1].Value;

            // 2. Extract all open Ports & Services
            //var portMatches = Regex.Matches(nmapOutput,@"(\d+)/tcp\s+open",RegexOptions.IgnoreCase); //Only Ports
            var portMatches = Regex.Matches(nmapOutput, @"(\d+)/tcp\s+open\s+([^\s]+)", RegexOptions.IgnoreCase);

            if (portMatches.Count == 0)
                return commands;

            // Store port and service
            var portServiceList = new List<KeyValuePair<string, string>>();

            // 3. Build comma-separated port list
            foreach (Match match in portMatches)
            {
                string port = match.Groups[1].Value;
                string service = match.Groups[2].Value;

                portServiceList.Add(new KeyValuePair<string, string>(port, service));
            }

            //Build comma-separated port list 
            var ports = portServiceList.Select(p => p.Key).ToList();
            string portList = string.Join(",", ports);

            #region exp Filecreator
            //            // 4. Build the expect command - NOT using C# string interpolation for the expect script itself
            //            string scanId = Guid.NewGuid().ToString("N").Substring(0, 6);
            //            string fileName = "auto_web_scan_" + scanId;
            //            string filePath =  fileName + ".exp";

            //            string expectScript =
            //"#!/usr/bin/expect -f\n" +
            //"set timeout 60\n" +
            //"log_user 1\n" +
            //"\n" +
            //"set USER \"" + username + "\"\n" +
            //"set PASS \"" + password + "\"\n" +
            //"set TARGET_NAME \"" + targetName + "\"\n" +
            //"set TARGET_IP \"" + ipAddress + "\"\n" +
            //"set PORTS \"" + portList + "\"\n" +
            //"set TASK_NAME \"" + fileName + "\"\n" +
            //"\n" +
            //"# Full and fast scan config UUID\n" +
            //"set CONFIG_ID \"daba56c8-73ec-11df-a475-002264764cea\"\n" +
            //"\n" +
            //"proc auth {} {\n" +
            //"  expect {\n" +
            //"    -re {Enter username.*} { send \"$::USER\\r\"; exp_continue }\n" +
            //"    -re {Enter password.*} { send \"$::PASS\\r\" }\n" +
            //"  }\n" +
            //"}\n" +
            //"\n" +
            //"# Create target\n" +
            //"spawn sudo -u _gvm gvm-cli socket --xml \"<create_target><name>$TARGET_NAME</name><hosts>$TARGET_IP</hosts><port_range>$PORTS</port_range></create_target>\"\n" +
            //"auth\n" +
            //"\n" +
            //"set TARGET_ID \"\"\n" +
            //"expect {\n" +
            //"  -re {id=\\\"([a-f0-9-]+)\\\"} {\n" +
            //"    set TARGET_ID $expect_out(1,string)\n" +
            //"  }\n" +
            //"  -re {Target exists already} {\n" +
            //"    spawn sudo -u _gvm gvm-cli socket --xml \"<get_targets/>\"\n" +
            //"    auth\n" +
            //"    expect -re {id=\\\"([a-f0-9-]+)\\\"}\n" +
            //"    set TARGET_ID $expect_out(1,string)\n" +
            //"  }\n" +
            //"}\n" +
            //"\n" +
            //"if {$TARGET_ID == \"\"} {\n" +
            //"  puts \"ERROR: TARGET_ID not found\"\n" +
            //"  exit 1\n" +
            //"}\n" +
            //"\n" +
            //"# Create task (Full and fast)\n" +
            //"spawn sudo -u _gvm gvm-cli socket --xml \"<create_task><name>$TASK_NAME</name><config id=\\\"$CONFIG_ID\\\"/><target id=\\\"$TARGET_ID\\\"/></create_task>\"\n" +
            //"auth\n" +
            //"\n" +
            //"set TASK_ID \"\"\n" +
            //"expect -re {id=\\\"([a-f0-9-]+)\\\"}\n" +
            //"set TASK_ID $expect_out(1,string)\n" +
            //"\n" +
            //"if {$TASK_ID == \"\"} {\n" +
            //"  puts \"ERROR: TASK_ID is empty\"\n" +
            //"  exit 1\n" +
            //"}\n" +
            //"\n" +
            //"# Start scan\n" +
            //"spawn sudo -u _gvm gvm-cli socket --xml \"<start_task task_id=\\\"$TASK_ID\\\"/>\"\n" +
            //"auth\n" +
            //"expect eof\n" +
            //"\n" +
            //"puts \"Scan started successfully\"\n" +
            //"puts \"Task Name: $TASK_NAME\"\n" +
            //"puts \"Task ID:   $TASK_ID\"\n";





            //            //string expectScript =
            //            //"#!/usr/bin/expect -f\n" +
            //            //"set timeout 60\n" +
            //            //"log_user 1\n" +
            //            //"\n" +
            //            //"set USER " + username + "\n" +
            //            //"set PASS " + password + "\n" +
            //            //"set TARGET_NAME " + targetName + "\n" +
            //            //"set TARGET_IP " + ipAddress + "\n" +
            //            //"set PORTS \"" + portList + "\"\n" +
            //            //"\n" +
            //            //"set TASK_NAME " + fileName + "\n" +
            //            //"\n" +
            //            //"proc auth {} {\n" +
            //            //"  expect {\n" +
            //            //"    -re {Enter username.*} { send \"$::USER\\r\"; exp_continue }\n" +
            //            //"    -re {Enter password.*} { send \"$::PASS\\r\" }\n" +
            //            //"  }\n" +
            //            //"}\n" +
            //            //"\n" +
            //            //"spawn sudo -u _gvm gvm-cli socket --xml \"<create_target><name>$TARGET_NAME</name><hosts>$TARGET_IP</hosts><port_range>$PORTS</port_range></create_target>\"\n" +
            //            //"auth\n" +
            //            //"set TARGET_ID \"\"\n" +
            //            //"\n" +
            //            //"expect {\n" +
            //            //"  -re {id=\\\"([a-f0-9-]+)\\\"} { set TARGET_ID $expect_out(1,string) }\n" +
            //            //"  -re {Target exists already} {\n" +
            //            //"    spawn sudo -u _gvm gvm-cli socket --xml \"<get_targets/>\"\n" +
            //            //"    auth\n" +
            //            //"    expect -re {" + targetName + ".*id=\\\"([a-f0-9-]+)\\\"}\n" +
            //            //"    set TARGET_ID $expect_out(1,string)\n" +
            //            //"  }\n" +
            //            //"}\n" +
            //            //"\n" +
            //            //"spawn sudo -u _gvm gvm-cli socket --xml \"<get_configs/>\"\n" +
            //            //"auth\n" +
            //            //"expect -re {<config id=\\\"([a-f0-9-]+)\\\">.*<name>Full and fast</name>}\n" +
            //            //"set CONFIG_ID $expect_out(1,string)\n" +
            //            //"\n" +
            //            //"spawn sudo -u _gvm gvm-cli socket --xml \"<create_task><name>$TASK_NAME</name><config id=\\\"$CONFIG_ID\\\"/><target id=\\\"$TARGET_ID\\\"/></create_task>\"\n" +
            //            //"auth\n" +
            //            //"expect -re {id=\\\"([a-f0-9-]+)\\\"}\n" +
            //            //"set TASK_ID $expect_out(1,string)\n" +
            //            //"\n" +
            //            //"spawn sudo -u _gvm gvm-cli socket --xml \"<start_task task_id=\\\"$TASK_ID\\\"/>\"\n" +
            //            //"auth\n" +
            //            //"expect eof\n" +
            //            //"\n" +
            //            //"puts \"Scan started successfully\"\n" +
            //            //"puts \"Task Name: $TASK_NAME\"\n" +
            //            //"puts \"Task ID:   $TASK_ID\"\n";

            //            File.WriteAllText(filePath, expectScript);

            //            commands.Add("expect "+filePath);
            //            commands.Add("expect taskid.exp auto_web_scan_0bf911");
            #endregion

            var services = portServiceList.Select(p => p.Value.ToLower().Trim()).ToList();

            //Get the services enables for the project - Recon Tools
            var reconTools = await _scanCommandRepo.GetReconToolsAsync(ProjectId);
            // Helper to fetch ports by service (flexible matching)
            Func<string, List<string>> getPortsByService = (serviceName) => portServiceList.Where(p => p.Value != null && p.Value.ToLower().Contains(serviceName.ToLower()))
                    .Select(p => p.Key).ToList();

            //Parsing services based on tools
            foreach (var tool in reconTools)
            {
                var toolName = tool.ToolName?.Trim().ToLower();

                switch (toolName)
                {
                    case "nmap":
                        // SSH
                        var sshPorts = getPortsByService("ssh");
                        if (sshPorts.Any())
                        {
                            commands.Add($"nmap --script ssh-auth-methods -p {string.Join(",", sshPorts)} {ipAddress}");
                        }

                        // HTTP / Web services
                        var webPorts = getPortsByService("http")
                            .Concat(getPortsByService("ov-nnm-websrv"))
                            .Distinct()
                            .ToList();

                        if (webPorts.Any())
                        {
                            commands.Add($"nmap --script http-title,http-enum -p {string.Join(",", webPorts)} {ipAddress}");
                        }

                        // Modbus (mbap)
                        var modbusPorts = getPortsByService("mbap");
                        if (modbusPorts.Any())
                        {
                            commands.Add($"nmap --script modbus-discover -p {string.Join(",", modbusPorts)} {ipAddress}");
                            commands.Add($"nmap --script modbus-enum -p {string.Join(",", modbusPorts)} {ipAddress}");
                            commands.Add("msfconsole -q -x 'use auxiliary/scanner/scada/modbusdetect; set RHOSTS " + ipAddress + "; run; exit'");
                        }

                        // EtherNet/IP
                        var enipPorts = getPortsByService("ethernetip");
                        if (enipPorts.Any())
                        {
                            commands.Add($"nmap --script enip-info -p {string.Join(",", enipPorts)} {ipAddress}");
                            commands.Add("msfconsole -q -x 'use auxiliary/scanner/scada/cip_enumeration; set RHOSTS " + ipAddress + ";  run; exit'");
                        }
                        
                        // NTP
                        var ntpPorts = getPortsByService("ntp");
                        if (ntpPorts.Any())
                        {
                            commands.Add($"nmap -sU -p {string.Join(",", ntpPorts)} --script ntp-* {ipAddress}");
                            commands.Add($"nmap -sU -p {string.Join(", ", ntpPorts)} --script ntp-info {ipAddress}");
                        }

                        // SNMP
                        var snmpPorts = getPortsByService("snmp");
                        if (snmpPorts.Any())
                        {
                            var snmports = string.Join(",", snmpPorts);
                            // Nmap SNMP scripts
                            commands.Add($"nmap -sU -p {snmports} --script snmp-info {ipAddress}");
                            commands.Add($"nmap -sU -p {snmports} --script snmp-brute {ipAddress}");
                            // SNMP enumeration (default community string)
                            commands.Add($"snmpwalk -v2c -c public {ipAddress}");
                        }

                        // Optional: full scan
                        //commands.Add($"nmap -sC -sV -p {portList} {ipAddress}");

                        break;


                    case "masscan":
                        commands.Add($"masscan {ipAddress} -p{portList} --rate=1000");
                        break;


                    case "amass":
                        // Better only for domain, but keeping fallback
                        commands.Add($"amass enum -passive -d {ipAddress}");
                        break;


                    case "dnsrecon":
                        commands.Add($"dnsrecon -r {ipAddress}/32");
                        break;


                    case "theharvester":
                        commands.Add($"theHarvester -d {ipAddress} -b all");
                        break;

                    case "sslyze":
                        commands.Add("sslyze " + ipAddress);
                        break;
                        
                }
            }

            //VS Tools of Project
            var vsTools = await _scanCommandRepo.GetVSToolsAsync(ProjectId);
            foreach (var tool in vsTools)
            {
                var toolName = tool.ToolName?.Trim().ToLower();

                switch (toolName)
                {
                    case "openvas":
                        commands.Add($"dotnet ../Openvas/OpenVasScanner.dll {ipAddress} {portList}");
                        break;

                    case "nikto":
                        commands.Add("nikto -h " + ipAddress + " -C all -ask no");
                        break;

                    case "sqlmap":
                        commands.Add("sqlmap -u http://" + ipAddress + " –crawl=3 –forms –level=5 –risk=3 --batch --threads=3 --timeout=10");
                        break;

                    case "zap":
                        commands.Add("dotnet ../Zap/ZapScanner.dll  http://" + ipAddress);
                        commands.Add("zaproxy -cmd -autorun /home/customkali/Desktop/PasTool/Microservice/PasService/zap-automation.yaml");
                        break;
                }
            }

            //Exploit Tools of Project
            var exploitTools = await _scanCommandRepo.GetExploitToolsAsync(ProjectId);
            foreach (var tool in exploitTools)
            {
                var toolName = tool.ToolName?.Trim().ToLower();

                switch (toolName)
                {
                    //case "metasploit-framework":

                    //    // Generic scan (can import Nmap results if needed)
                    //    commands.Add($"msfconsole -q -x \"db_nmap {ipAddress}; exit\"");

                    //    // SSH exploitation (if SSH exists)
                    //    var sshPorts = getPortsByService("ssh");
                    //    if (sshPorts.Any())
                    //    {
                    //        commands.Add(
                    //            $"msfconsole -q -x \"use auxiliary/scanner/ssh/ssh_login; " +
                    //            $"set RHOSTS {ipAddress}; set RPORT {string.Join(",", sshPorts)}; " +
                    //            $"set USER_FILE users.txt; set PASS_FILE passwords.txt; run; exit\""
                    //        );
                    //    }

                    //    // Modbus (ICS)
                    //    var modbusPorts = getPortsByService("mbap");
                    //    if (modbusPorts.Any())
                    //    {
                    //        commands.Add(
                    //            $"msfconsole -q -x \"use auxiliary/scanner/scada/modbusdetect; " +
                    //            $"set RHOSTS {ipAddress}; run; exit\""
                    //        );
                    //    }

                    //    // EtherNet/IP
                    //    var enipPorts = getPortsByService("ethernetip");
                    //    if (enipPorts.Any())
                    //    {
                    //        commands.Add(
                    //            $"msfconsole -q -x \"use auxiliary/scanner/scada/cip_enumeration; " +
                    //            $"set RHOSTS {ipAddress}; run; exit\""
                    //        );
                    //    }

                    //    break;


                    case "hydra":                        
                        commands.Add("hydra -L /home/customkali/Desktop/PasTool/Microservice/PasService/users.txt -P /home/customkali/Desktop/PasTool/Microservice/PasService/passwords.txt -t 2 -W 5 -f " + ipAddress + " http-get");
                        commands.Add("hydra -L /home/customkali/Desktop/PasTool/Microservice/PasService/users.txt -P /home/customkali/Desktop/PasTool/Microservice/PasService/passwords.txt -t 2 -W 5 -f " + ipAddress + " ftp");
                        commands.Add("hydra -L /home/customkali/Desktop/PasTool/Microservice/PasService/users.txt -P /home/customkali/Desktop/PasTool/Microservice/PasService/passwords.txt -t 2 -W 5 -f " + ipAddress + " ssh");



                        break;
                }
            }

            /*
            commands.Add("nikto -h " + ipAddress + " -C all -ask no");
            commands.Add("dotnet ../Zap/ZapScanner.dll  http://" + ipAddress);
            commands.Add("zaproxy -cmd -autorun /home/customkali/Desktop/PasTool/Microservice/PasService/zap-automation.yaml");
            commands.Add("sqlmap -u http://" + ipAddress + " –crawl=3 –forms –level=5 –risk=3 --batch --threads=3 --timeout=10");
            commands.Add("snmpwalk -v2c -c public " + ipAddress);
            commands.Add("sslyze " + ipAddress);
            commands.Add("dnsrecon -r " + ipAddress + "/32");
            commands.Add("hydra -L /home/customkali/Desktop/PasTool/Microservice/PasService/users.txt -P /home/customkali/Desktop/PasTool/Microservice/PasService/passwords.txt -t 2 -W 5 -f " + ipAddress + " http-get");
            commands.Add("nmap -sU -p 123 --script ntp-* " + ipAddress);
            commands.Add("nmap -sU -p 123 --script ntp-info " + ipAddress);
            commands.Add("hydra -L /home/customkali/Desktop/PasTool/Microservice/PasService/users.txt -P /home/customkali/Desktop/PasTool/Microservice/PasService/passwords.txt -t 2 -W 5 -f " + ipAddress + " ftp");
            commands.Add("hydra -L /home/customkali/Desktop/PasTool/Microservice/PasService/users.txt -P /home/customkali/Desktop/PasTool/Microservice/PasService/passwords.txt -t 2 -W 5 -f " + ipAddress + " ssh");


            //Port 502 Modbus
            commands.Add("nmap --script modbus-discover -p 502 " + ipAddress);
            commands.Add("nmap --script modbus-enum -p 502 " + ipAddress);
            commands.Add("msfconsole -q -x 'use auxiliary/scanner/scada/modbusdetect; set RHOSTS " + ipAddress + "; run; exit'");


            //Port 44818  EtherNet/IP
            commands.Add("nmap --script enip-info -p 44818 " + ipAddress);
            commands.Add("msfconsole -q -x 'use auxiliary/scanner/scada/cip_enumeration; set RHOSTS " + ipAddress + ";  run; exit'");

            commands.Add("dotnet ../Openvas/OpenVasScanner.dll  " + ipAddress + " " + portList);
            */

            return commands;
        }
    }
}