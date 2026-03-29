using Npgsql;
using PasToMicroservice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PasToMicroservice.DAL
{
    public class ScanCommandRepository : IScanCommandRepository
    {
        private readonly string _connectionString;

        public ScanCommandRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<ScanCommand>> GetPendingCommandsAsync()
        {
            var commands = new List<ScanCommand>();

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = "SELECT id, command,project_id,job_id FROM scan_data WHERE scan_status='Pending' ORDER BY id";
            await using var cmd = new NpgsqlCommand(query, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                commands.Add(new ScanCommand
                {
                    Id = reader.GetInt32(0),
                    Command = reader.GetString(1),
                    ScanStatus = "Pending",
                    ProjectId = reader.GetInt32(2),
                    JobId = reader.GetInt32(3),
                });
            }

            return commands;
        }

        public async Task UpdateStatusAsync(int id, string status)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = "UPDATE scan_data SET scan_status=@status WHERE id=@id";
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("status", status);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task SaveResultAsync(int id, string result, string status)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
                UPDATE scan_data 
                SET scan_status=@status, scan_result=@result, completed_at=NOW()
                WHERE id=@id";

            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("status", status);
            cmd.Parameters.AddWithValue("result", result ?? (object)DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
        }


        //Added for subcommands
        public async Task InsertPendingCommandsAsync(List<string> commands,int scanId,int projectId,int jobid)
        {
            if (commands == null || commands.Count == 0)
                return;

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            foreach (var command in commands)
            {
                int scansegment = 0;

                var cmdData = command.ToLower();

                if (cmdData.Contains("nmap") || cmdData.Contains("masscan") || cmdData.Contains("dnsrecon") || cmdData.Contains("sslyze") || cmdData.Contains("snmpwalk"))
                {
                    scansegment = 1;
                }
                else if (cmdData.Contains("nikto") || cmdData.Contains("zaproxy") || cmdData.Contains("sqlmap") || cmdData.Contains("openvasscanner"))
                {
                    scansegment = 2;
                }
                else if (cmdData.Contains("msfconsole") || cmdData.Contains("hydra"))
                {
                    scansegment = 3;
                }
                else
                {
                    scansegment = 0;
                }

                //else if (command.Contains("ZapScanner"))
                //{
                //    scansegment = 0;
                //}

                string scanType = command.Split(' ', StringSplitOptions.RemoveEmptyEntries)[0];
                string query = @"
                    INSERT INTO scan_data (scan_type,command, scan_status,created_by,updated_by,triggered_by,parent_scan_id,project_id,job_id,scan_segment) 
                    VALUES (@scantype,@command, 'Pending',1,1,1,@scanId,@project_id,@job_id,@scan_segment)";
                //Console.WriteLine(query);

                if (scanType.ToLower().Contains("dotnet") && command.ToLower().Contains("openvas"))
                {
                    scanType = "OpenvasScanner";
                }
                scanType = char.ToUpper(scanType[0]) + scanType.Substring(1);
               

                await using var cmd = new NpgsqlCommand(query, conn);
                if (command.ToLower().Contains("openvas"))
                {
                    cmd.Parameters.AddWithValue("command", command + " " + projectId.ToString() + " " + jobid.ToString() + " " + scanId.ToString());
                }
                else
                {
                    cmd.Parameters.AddWithValue("command", command);
                }
                cmd.Parameters.AddWithValue("scanId", scanId);
                cmd.Parameters.AddWithValue("project_id", projectId);
                cmd.Parameters.AddWithValue("scantype", scanType);
                cmd.Parameters.AddWithValue("job_id", jobid);
                cmd.Parameters.AddWithValue("scan_segment", scansegment);
                await cmd.ExecuteNonQueryAsync();
            }
        }


        //Added for getting Recontools based on project id
        public async Task<List<ReconTool>> GetReconToolsAsync(int projectId)
        {
            var resultList = new List<ReconTool>();

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"SELECT pc.project_id, rt.rid, rt.tool_name FROM project_configuration pc JOIN reconnaissance_tools rt ON rt.rid = ANY(pc.rtool_id) WHERE pc.project_id = @projectId;";

            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("projectId", projectId);

            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new ReconTool
                {
                    ProjectId = reader.GetInt32(0),
                    Rid = reader.GetInt32(1),
                    ToolName = reader.GetString(2)
                };

                resultList.Add(item);
            }

            return resultList;
        }

        //Added for getting VulScan based on project id
        public async Task<List<VSTool>> GetVSToolsAsync(int projectId)
        {
            var resultList = new List<VSTool>();

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"SELECT pc.project_id, vt.vsid, vt.tool_name FROM project_configuration pc JOIN vulnerability_scan_tools vt ON vt.vsid = ANY(pc.vstool_id) WHERE pc.project_id = @projectId;";

            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("projectId", projectId);

            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new VSTool
                {
                    ProjectId = reader.GetInt32(0),
                    Vid = reader.GetInt32(1),
                    ToolName = reader.GetString(2)
                };

                resultList.Add(item);
            }

            return resultList;
        }

        //Added for Get ExploitationTools
        public async Task<List<ExploitTool>> GetExploitToolsAsync(int projectId)
        {
            var resultList = new List<ExploitTool>();

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"SELECT pc.project_id, et.eid, et.tool_name FROM project_configuration pc JOIN exploitation_tools et ON et.eid = ANY(pc.etool_id) WHERE pc.project_id = @projectId";

            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("projectId", projectId);

            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new ExploitTool
                {
                    ProjectId = reader.GetInt32(0),
                    Eid = reader.GetInt32(1),
                    ToolName = reader.GetString(2)
                };

                resultList.Add(item);
            }

            return resultList;
        }
    }
}
