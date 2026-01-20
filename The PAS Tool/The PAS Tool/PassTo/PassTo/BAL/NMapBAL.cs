using BAL;
using Cryptography;
using DAL;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Models;
using Newtonsoft.Json;
using PassTo.Models;
using System.Data;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Utils;
namespace PassTo.BAL
{
    public class NMapBAL
    {
        public static DataTable GetAllNMapCommands()
        {
            try
            {
                var dt = DataAccessLayer.GetDataTable(SqlStatement.GetAllNMapCommands);
                return dt;
            }
            catch (Exception ex) 
            { 
                 Console.WriteLine($"Error in GetAllNMapCommands: { ex.Message}");
                throw;
            }
        }


        //Method will not be used
        //Sunil 18-11-2025
        public static int UpdateNMapCommandsRunStatus(string commandsJson)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(commandsJson))
                {
                    Console.WriteLine("Validation Failed: commandsJson is null or empty");
                    return -1;
                }

                List<CommandUpdateModel> commands;
                try
                {
                    commands = JsonConvert.DeserializeObject<List<CommandUpdateModel>>(commandsJson);
                }
                catch (JsonException jsonEx)
                {
                    Console.WriteLine($"JSON Deserialization Error: {jsonEx.Message}");
                    return -1;
                }

                if (commands == null || commands.Count == 0)
                {
                    Console.WriteLine("Validation Failed: commands list is null or empty");
                    return -1;
                }

                foreach (var cmd in commands)
                {
                    if (cmd.Id <= 0)
                    {
                        Console.WriteLine($"Validation Failed: Invalid command ID {cmd.Id}");
                        return -1;
                    }
                }

                int result = DataAccessLayer.UpdateNMapCommandsRunStatus(commands);

                if (result > 0)
                {
                    Console.WriteLine($"Successfully updated {result} command(s)");
                    return 1;
                }
                else if (result == -1)
                {
                    Console.WriteLine("Database operation failed");
                    return 0;
                }
                else
                {
                    Console.WriteLine("No rows were updated");
                    return 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateNMapCommandsRunStatus BAL: {ex.Message}");
                return 0;
            }
        }


        public static  int CreateScanTasks(string commandsJson)
        {
            bool flag = true;
            List<ScanTaskDto> tasks = JsonConvert.DeserializeObject<List<ScanTaskDto>>(commandsJson);

            foreach (var t in tasks)
            {
                string cleanedCommand = RemoveIPAddress(t.Command);
                Console.WriteLine($"ID: {t.Id}, CMD: {t.Command}");
                ScanData ScanData = new ScanData
                {
                    scan_type = "Nmap",
                    command = t.Command,
                    created_at = DateTime.UtcNow,
                    //completed_at = string.Empty,
                    created_by = 1,//(int)SessionValues.UserId,
                    updated_by = 1,//(int)SessionValues.UserId,
                    scan_status = "Pending",
                    scan_result = string.Empty,
                    triggered_by = 1//(int)SessionValues.UserId
                };
                int result=DataAccessLayer.ExecuteNonQuery(SqlStatement.InsertScanData, ScanData);
                if(result>0)
                {
                    flag= true;
                }
                else
                {
                    flag = false;
                }
            }
            if (flag)
            {
                return tasks.Count;

            }
            else
            {
                 return 0;
            }

        }


        public static List<string> GetCommands()
        {
            try
            {
                var dt = DataAccessLayer.GetDataTable(SqlStatement.GetCommands);
                List<string> commands = dt.AsEnumerable().Select(row => row.Field<string>("command_name")).ToList();
                return commands;
            }
            catch (Exception ex)
            {
                string src = ex.ProcessException();
                throw new Exception($"Error loading Command names: {src} ");
            }
        }


        public static List<ScanDataDto> GetNmapScans()
        {
            try
            {
                var dt = DataAccessLayer.GetDataTable(SqlStatement.GetScanStatus);
                List<ScanDataDto> scanStatus = dt.AsEnumerable()
    .Select(row => new ScanDataDto
    {
        Id = row.Field<long>("id"),
        ScanType = row.Field<string>("scan_type"),
        Command = row.Field<string>("command"),
        CreatedAt = row.Field<DateTime>("created_at"),
        CompletedAt = row.Field<DateTime?>("completed_at"),
        CreatedBy = row.Field<int?>("created_by"),
        UpdatedBy = row.Field<int?>("updated_by"),
        ScanStatus = row.Field<string>("scan_status"),
        ScanResult = row.Field<string>("scan_result"),
        TriggeredBy = row.Field<int?>("triggered_by")
    })
    .ToList();

                return scanStatus;
            }
            catch (Exception ex)
            {
                string src = ex.ProcessException();
                throw new Exception($"Error loading Command names: {src} ");
            }
        }
        public static string SaveScanData(ScanData ScanData)
        {
            return DataAccessLayer.ExecuteScalar(SqlStatement.InsertScanData, ScanData);
        }

        private static string RemoveIPAddress(string command)
        {
            if (string.IsNullOrWhiteSpace(command))
                return command;

            // IPv4 regex
            string ipv4Pattern = @"\b(?:\d{1,3}\.){3}\d{1,3}\b";

            // IPv6 regex
            string ipv6Pattern = @"((?:(?:[A-F0-9]{1,4}):){7}[A-F0-9]{1,4})";

            string cleaned = Regex.Replace(command, ipv4Pattern, "").Trim();
            cleaned = Regex.Replace(cleaned, ipv6Pattern, "").Trim();

            return cleaned;
        }
    }
}
