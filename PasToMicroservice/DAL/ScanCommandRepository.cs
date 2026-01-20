using Npgsql;
using PasToMicroservice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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

            string query = "SELECT id, command,project_id FROM scan_data WHERE scan_status='Pending' ORDER BY id";
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
        public async Task InsertPendingCommandsAsync(List<string> commands,int scanId,int projectId)
        {
            if (commands == null || commands.Count == 0)
                return;

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            foreach (var command in commands)
            {
                string scanType = command.Split(' ', StringSplitOptions.RemoveEmptyEntries)[0];
                string query = @"
                    INSERT INTO scan_data (scan_type,command, scan_status,created_by,updated_by,triggered_by,parent_scan_id,project_id) 
                    VALUES (@scantype,@command, 'Pending',1,1,1,@scanId,@project_id)";
                Console.WriteLine(query);

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("command", command);
                cmd.Parameters.AddWithValue("scanId", scanId);
                cmd.Parameters.AddWithValue("project_id", projectId);
                cmd.Parameters.AddWithValue("scantype", scanType);
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
