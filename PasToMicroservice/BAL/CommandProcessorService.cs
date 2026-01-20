using PasToMicroservice.DAL;
using PasToMicroservice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasToMicroservice.BAL
{
    public class CommandProcessorService : ICommandProcessorService
    {
        private readonly IScanCommandRepository _repository;
        private readonly ICommandExecutor _executor;

        public CommandProcessorService(IScanCommandRepository repository, ICommandExecutor executor)
        {
            _repository = repository;
            _executor = executor;
        }

        public async Task ProcessPendingCommandsAsync()
        {
            var commands = await _repository.GetPendingCommandsAsync();

            if (commands.Count == 0)
            {
                Console.WriteLine("No pending commands.");
                return;
            }

            foreach (var scanCommand in commands)
            {
                await ProcessSingleCommandAsync(scanCommand);
            }
        }

        private async Task ProcessSingleCommandAsync(ScanCommand scanCommand)
        {
            try
            {
                Console.WriteLine($"[ID={scanCommand.Id}] Starting command: {scanCommand.Command}");

                // Update status to InProgress
                await _repository.UpdateStatusAsync(scanCommand.Id, "InProgress");

                // Execute command
                //string result = _executor.ExecuteCommand(scanCommand.Command);

                // Execute command and get parsed enum4linux commands
                var (result, enumCommands) = _executor.ExecuteCommand(scanCommand.Command,scanCommand.Id);

                // Insert any enum4linux commands IMMEDIATELY after parsing
                if (enumCommands != null && enumCommands.Count > 0)
                {
                    Console.WriteLine($"[ID={scanCommand.Id}] Found {enumCommands.Count} commands, saving to database...");
                    await _repository.InsertPendingCommandsAsync(enumCommands, scanCommand.Id,scanCommand.ProjectId);
                    Console.WriteLine($"[ID={scanCommand.Id}] Successfully saved {enumCommands.Count} commands to database.");
                }

                // Save result with Completed status
                await _repository.SaveResultAsync(scanCommand.Id, result, "Completed");

                Console.WriteLine($"[ID={scanCommand.Id}] Completed and result saved.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ID={scanCommand.Id}] Error: {ex.Message}");

                // Save error result with Failed status
                await _repository.SaveResultAsync(
                    scanCommand.Id,
                    $"Error: {ex.Message}\n{ex.StackTrace}",
                    "Failed"
                );
            }
        }
    }
}
