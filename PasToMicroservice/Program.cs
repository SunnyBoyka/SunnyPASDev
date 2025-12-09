// See https://aka.ms/new-console-template for more information
using Npgsql;
using PasToMicroservice.BAL;
using PasToMicroservice.DAL;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

class Program
{
    static async Task Main(string[] args)
    {

        #region OLD Logic

        ////string connStr = "Host=192.168.225.131;Port=5432;Database=pasdb;Username=postgres;Password=root@123;";
        //// Read connection string from file
        //string connStr = await File.ReadAllTextAsync("connection.txt");
        //connStr = connStr.Trim(); // Remove any leading/trailing whitespace

        //// Initialize DAL and BAL
        //var repository = new ScanCommandRepository(connStr);
        //var executor = new CommandExecutor();
        //var processorService = new CommandProcessorService(repository, executor);

        //while (true)
        //{
        //    await processorService.ProcessPendingCommandsAsync();
        //    await Task.Delay(20000);
        //}

        #endregion

        // Build configuration
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        // Read connection string
        string connStr = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connStr))
        {
            Console.WriteLine("Connection string not found in configuration.");
            return;
        }

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


