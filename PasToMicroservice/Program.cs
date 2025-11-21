// See https://aka.ms/new-console-template for more information
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Npgsql;

class Program
{
    static async Task Main(string[] args)
    {
        while (true)
        {
            await ProcessPendingCommands();
            await Task.Delay(20000);
        }
    }

    static async Task ProcessPendingCommands()
    {
        string connStr = "Host=192.168.225.51;Port=5432;Database=pasdb;Username=postgres;Password=root@123;";

        await using var conn = new NpgsqlConnection(connStr);
        await conn.OpenAsync();

        string query = "SELECT id, command FROM scan_data WHERE scan_status='Pending' ORDER BY id";

        await using var cmd = new NpgsqlCommand(query, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        if (!reader.HasRows)
        {
            Console.WriteLine("No pending commands.");
            return;
        }

        var commands = new List<(int id, string cmd)>();

        while (await reader.ReadAsync())
        {
            commands.Add((reader.GetInt32(0), reader.GetString(1)));
        }

        reader.Close();

        foreach (var (id, command) in commands)
        {
            Console.WriteLine($"[ID={id}] Starting command: {command}");

            // STEP 1: Mark as InProgress
            string updateStart = "UPDATE scan_data SET scan_status='InProgress' WHERE id=@id";
            await using (var updateCmd = new NpgsqlCommand(updateStart, conn))
            {
                updateCmd.Parameters.AddWithValue("id", id);
                await updateCmd.ExecuteNonQueryAsync();
            }

            // STEP 2: Execute command and wait
            string output = RunLinuxCommand(command);

            // STEP 3: Save result
            string updateFinish = @"
                UPDATE scan_data 
                SET scan_status='Completed', scan_result=@res, completed_at=NOW()
                WHERE id=@id";

            await using (var finishCmd = new NpgsqlCommand(updateFinish, conn))
            {
                finishCmd.Parameters.AddWithValue("id", id);
                finishCmd.Parameters.AddWithValue("res", output);
                await finishCmd.ExecuteNonQueryAsync();
            }

            Console.WriteLine($"[ID={id}] Completed and result saved.");
        }
    }

    static string RunLinuxCommand(string command)
    {
        var process = new Process();
        process.StartInfo.FileName = "/bin/bash";
        process.StartInfo.Arguments = $"-c \"{command}\"";
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardError = true;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true; // no GUI

        process.Start();

        // Capture both STDOUT and STDERR
        string output = process.StandardOutput.ReadToEnd();
        string error = process.StandardError.ReadToEnd();

        // Wait for command to fully finish
        process.WaitForExit();

        return output + "\n" + error;
    }
}


