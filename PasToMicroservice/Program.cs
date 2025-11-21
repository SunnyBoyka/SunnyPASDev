// See https://aka.ms/new-console-template for more information
using Npgsql;
using PasToMicroservice.BAL;
using PasToMicroservice.DAL;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        string connStr = "Host=192.168.225.131;Port=5432;Database=pasdb;Username=postgres;Password=root@123;";

        // Initialize DAL and BAL
        var repository = new ScanCommandRepository(connStr);
        var executor = new CommandExecutor();
        var processorService = new CommandProcessorService(repository, executor);

        while (true)
        {
            await processorService.ProcessPendingCommandsAsync();
            await Task.Delay(20000);
        }
    }
}


