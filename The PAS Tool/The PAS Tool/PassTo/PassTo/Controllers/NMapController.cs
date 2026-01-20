using BAL;
using CRLManager.BAL;
using PassTo.BAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MinimalOverflow;
using Models;
using Newtonsoft.Json;
using System.Xml.Linq;
using Utils;

namespace MinimalOverflow.Controllers
{
    public partial class HomeController : Controller
    {
        /// <summary>
        /// url : ~/Home/GetAllNMapCommands
        /// </summary>
        /// <returns></returns>
        [AuthorizedRoles(new[] { "admin" })]
        public string GetAllNMapCommands()
        {
            try
            {
                var commands = NMapBAL.GetAllNMapCommands();
                return JsonConvert.SerializeObject(commands);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllNMapCommands controller:{ex.Message}");
                return JsonConvert.SerializeObject(new { error = "Failed to fetch NMapCommands" });
            }
        }

        /// <summary>
        /// url : ~/Home/UpdateNMapCommandsRunStatus
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthorizedRoles(new[] { "admin" })]
        public int UpdateNMapCommandsRunStatus(string commandsData)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(commandsData))
                {
                    Console.WriteLine("Controller validation failed: commandsData is null or empty");
                    return -1;
                }

                return NMapBAL.UpdateNMapCommandsRunStatus(commandsData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateNMapCommandsRunStatus controller: {ex.Message}");
                return 0;
            }
        }

        /// <summary>
        /// url : ~/Home/UpdateNMapCommandsRunStatus
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthorizedRoles(new[] { "admin" })]
        public int CreateScanTasks(string commandsData)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(commandsData))
                {
                    Console.WriteLine("Controller validation failed: commandsData is null or empty");
                    return -1;
                }

                return NMapBAL.CreateScanTasks(commandsData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateScanTasks controller: {ex.Message}");
                return 0;
            }
        }


        [HttpGet]
        public IActionResult GetCommands()
        {
            try
            {
                var commands = NMapBAL.GetCommands();
                return Ok(commands);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }




        [HttpGet]
        public IActionResult GetNmapScans()
        {
            try
            {
                var scanStatus = NMapBAL.GetNmapScans();
                return Ok(scanStatus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



        public string SaveScanData()
        {
            try
            {
                //if (SessionValues.UserRole != "admin") return "Remote Data should be added by admin only.";
                string scandataStr = Request.Query["scan_data"];
                if (string.IsNullOrEmpty(scandataStr))
                {
                    return " 'remote_data' is empty.";
                }
                // note : make which pki should be unique 
                var scandata = JsonConvert.DeserializeObject<ScanData>(scandataStr);
                if (scandata == null)
                {
                    return " Unable to parse project data.";
                }
                NMapBAL.SaveScanData(scandata);
                // BusinessLayer.ApplicationLogs($"Success: Project added successfully :{project.project_name}", "Success");
                return "Success: Remote Data added successfully.";
            }
            catch (Exception ex)
            {
                string src = ex.ProcessException().ToString();
                BusinessLayer.ApplicationLogs("Error inserting project", "ERROR");
                return $"Error: An unexpected error occurred. {src}";
            }
        }





    }
}
