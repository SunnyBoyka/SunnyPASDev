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

            string query = "SELECT id, command FROM scan_data WHERE scan_status='Pending' ORDER BY id";
            await using var cmd = new NpgsqlCommand(query, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                commands.Add(new ScanCommand
                {
                    Id = reader.GetInt32(0),
                    Command = reader.GetString(1),
                    ScanStatus = "Pending"
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
    }
}
