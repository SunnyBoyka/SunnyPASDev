using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;


namespace Models
{
    public class searchModel
    {
        public string label = string.Empty;
        public string value = string.Empty;
    }
   
    public class Gate
    {
        public int id { get; set; }
        public String Name { get; set; } = string.Empty;

    }
    public class GateHandler
    {
        static List<Gate>? GateList { get; set; } = default;
        public static List<Gate> GetGateList()
        {
            if (GateHandler.GateList == null) GateHandler.GateList = new List<Gate>() { new Gate { id = 1, Name = "sgr" }, new Gate { id = 2, Name = "pgr" },
              new Gate { id = 3, Name = "cgr_a" },new Gate { id = 4, Name = "cgr_i" } , new Gate { id = 5, Name = "fei" },new Gate { id = 6, Name = "iqa" }
            , new Gate { id = 7, Name = "vgr" }, new Gate { id = 8, Name = "fqa" }};
            return GateHandler.GateList;
        }
    }
    public class DBModel
    {
        public static string sp_base_name = "sp_insert_or_update_dfq_data_";
        public static String GetStoredProcedureName(String gate) { return DBModel.sp_base_name + gate; }
    }
    public class DataTableClassBasicEx
    {
        public int draw; //Current page number , this comes formthe front end
        public int recordsTotal;//: 57 // total records in the database
        public int recordsFiltered;//: 57 // total records after search - unclear what is this
        public List<Object[]>? data; // the data to be displayed in the table
    }

    public class Tenant
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string ConnectionString { get; set; } = string.Empty;
        public string DownloadPath { get; set; }

        public static string? GetConnectionString(List<Tenant>? Allts, string? urlTenant)
        {
            if (Allts == null) return null; //if Allts is null return null
            if (urlTenant == null) return null; //if urlTenant is null return null   
            return Allts.Find(x => String.Compare(x.Name, urlTenant, true) == 0)?.ConnectionString; //if find fails return null else return connection string
        }
    }
    public class AuthenticationModel
    {
        public string? Name { get; set; }
        public string? Secret { get; set; }
        public int[]? Expiry { get; set; }
    }

    public class ProjectsModel
    {
        public int Id { get; set; }
        public string? Project_Id { get; set; }
        public string? Project_Name { get; set; }
        public DateTime? Time { get; set; }

    }

    public class UserModel
    {
        public int? Id { get; set; }
        public int GUID { get; set; }
        public required string User_Id { get; set; }
        public string? User_Name { get; set; }
        public string? Hashed_String { get; set; }
        public string? Role { get; set; }
        public string? Salt { get; set; }

    }

    public class UserInfo
    {
        public long id { get; set; }
        public string password { get; set; }
        public string user_mail { get; set; }
        public string user_name { get; set; }
        public string user_role { get; set; }
    }  

    public class LoadProjectsForCertificate
    {
        public string projectIdupload { get; set; }
        public string projectNameupload { get; set; }
    }
    public class LoadDPKIProjectsForCertificate
    {
        public string project_id { get; set; }
        public string projectNameupload { get; set; }
    }
    

    public class CRLProject
    {
        public string ProjectId { get; set; } // This can be auto-incremented in the database
        public string ProjectName { get; set; }

    }

    public class ApplicationLogs
    {
        public int tslog_id { get; set; }
        public DateTime log_timestamp { get; set; }
        public string error_message { get; set; }
        public string event_type { get; set; }
    }


    //public class Log
    //{
    //    public int LogID { get; set; }
    //    public DateTime Timestamp { get; set; }
    //    public string LogLevel { get; set; }
    //    public string Message { get; set; }
    //}
    
   
    public class TheProject
    {
        public string project_name { get; set; }
        public string project_id { get; set; }
        public bool pki_setup { get; set; }
    }
    
    public class ConnectionModel
    {
        public string ConnectionID { get; set; }
        public bool isOccupied { get; set; }
        public DateTime last_accessed_Time { get; set; }
    }

    public class CommandUpdateModel
    {
        public int Id { get; set; }
        public bool RunCommand { get; set; }
    }




    public class ScanData
    {
        public string scan_type { get; set; }
        public string command { get; set; }
        public DateTime created_at { get; set; }
        public DateTime completed_at { get; set; }
        public int created_by { get; set; }
        public int updated_by { get; set; }
        public string scan_status { get; set; }
        public string scan_result { get; set; }
        public int triggered_by { get; set; }
    }
}