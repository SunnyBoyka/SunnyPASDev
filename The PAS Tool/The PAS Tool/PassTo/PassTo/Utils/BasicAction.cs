using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace Utils
{
    using Microsoft.Extensions.Configuration;
    using Newtonsoft.Json;
    using System.Globalization;
    using System.IO;
    using Models;
    using MinimalOverflow;
    using System.Collections.Concurrent;
    using Microsoft.CodeAnalysis.Elfie.Diagnostics;
    using Microsoft.CodeAnalysis.CSharp.Syntax;
    using Microsoft.AspNetCore.Authorization;
    using System.Reflection;
    //using CRLManager.Controllers;

    public enum ErrorCodes { Success = 1, GetSQLForProjectsTableUpdateEmptyArguments = -35, MoveDFQDataArgsEmpty = -21, MoveDFQDataForbiddenAccess = -101, MoveDFQDataSomeNumbersAreNegative = -11, MoveDFQDataForbiddenForThisRole = -102 };

    public static class BasicAction
    {
        public static string[] AnonymousMethods = null;
        public readonly static string[] Angels = new[] { "ramba", "urvashi", "menka", "draupadi", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "ambalika", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "droupadi", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "droupadi", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "droupadi", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "droupadi", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "droupadi", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "droupadi", "gandhari", "ambika", "kunti", "satyavati", "subhadra", "sita", "mandodari", "ahalya", "tara", "damayanti", "shakuntala", "droupadi", "satya" , "rukmini", "jambavati"};
        //public readonly static ConcurrentDictionary<string, int> UsersParallelConnections = new ConcurrentDictionary<string, int>();
        public readonly static ConcurrentDictionary<string, List<ConnectionModel>> UsersParallelConnections = new ConcurrentDictionary<string, List<ConnectionModel>>(); 
        public readonly static int maxParallelConnections = 1;
        public readonly static  TimeSpan ExpireTimeSpan;

        public readonly static HttpContextAccessor contextAccessor = new HttpContextAccessor(); //----> (1b) search for 1a in Program.cs
        public static readonly String? API_KEY = null;
        public static readonly Random rand = new Random();
        public static readonly CultureInfo ci;
        public static readonly String? ConArtist = null;
        public static readonly String? UploadFolder = null;
        public static readonly String? Profile = null;
        public static int pageExempted = 0;
        public static readonly int KeySize = 256;
        public static readonly int BlockSize = 128;
        public static readonly int FeedbackSize = 128;
        public static readonly string iv = "CRL Manager Amaz"; //Needs to be length 32
        //public static readonly string iv = "Deliver Fr Quality N Amazing App"; //Needs to be length 32
        public static readonly string AESKey = "In simplicity lies his greatness";

        public static readonly string LogPath = "C:\\Project\\CRLManager\\src\\WebHMI\\CRLManager\\Logs";
        public static readonly string Exception = "C:\\Project\\CRLManager\\src\\WebHMI\\CRLManager\\Exception";

        public static string? VirtualImgDirectory = @"/Content/Profile" + "~" + @"/" + "_CURRRENT_USER_" + @"/";
        public static readonly List<Tenant>? AllTenants;
        public static readonly AuthenticationModel? AuthModel;
        public static IConfigurationRoot? configurationForAppSettingsDotJSON;
        public static readonly string? CAPKI2MULTIPEMCrlDirectoryPath = @"C:\git\ConvertCRLs\otpkicrlmanager\PKI2CAaggregatedCRL";
        public static readonly string? SavedSinglePKICertificates = @"C:\git\code refactorying\MicroServicesFileManagement\SavedSinglePKICertificates";
        public static readonly string? SavedPKI1Certificates = @"C:\git\code refactorying\MicroServicesFileManagement\SavedPKI1Certificates";
        public static readonly string? SavedPKI2Certificates = @"C:\git\code refactorying\MicroServicesFileManagement\SavedPKI2Certificates";
        public static readonly string? SinglePKIPEMCertificates = @"C:\git\code refactorying\MicroServicesFileManagement\SinglePKIPemCertificates";
        public static readonly string? PKI1PEMCertificates = @"C:\git\code refactorying\MicroServicesFileManagement\PKI1PemCertificates";
        public static readonly string? PKI2PEMCertificates = @"C:\git\code refactorying\MicroServicesFileManagement\PKI2PemCertificates";
        public static readonly string? SinlgePKIMultiPEMCertificate = @"C:\git\code refactorying\MicroServicesFileManagement\SinglePKIMultiPemCertificate";
        public static readonly string? PKI1MultiPEMCertificate = @"C:\git\code refactorying\MicroServicesFileManagement\PKI1MultiPemCertificate";
        public static readonly string? PKI2MultiPEMCertificats = @"C:\git\code refactorying\MicroServicesFileManagement\PKI2MultiPemCertificate";

        static BasicAction()
        {   
            BasicAction.ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat = new NumberFormatInfo();
            ci.NumberFormat.NumberDecimalSeparator = ".";

            configurationForAppSettingsDotJSON = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

            var TenantsSection = configurationForAppSettingsDotJSON.GetSection("Tenants");
            BasicAction.AllTenants = TenantsSection.Get<List<Tenant>>();
            foreach (var tenant in AllTenants)
            {
                if (!String.IsNullOrEmpty(tenant.DownloadPath)) Directory.CreateDirectory(tenant.DownloadPath);
            }

            var AuthSection = configurationForAppSettingsDotJSON.GetSection("Authentication");
            BasicAction.AuthModel = AuthSection.Get<AuthenticationModel>();

            BasicAction.CAPKI2MULTIPEMCrlDirectoryPath = configurationForAppSettingsDotJSON.GetSection("CRLAuthDIR").Value;
            BasicAction.API_KEY = configurationForAppSettingsDotJSON.GetSection("API_KEY").Value;

            //generate unique key for for every connection up to a max of UsersParallelConnections
            //for (int i = 0; i < BasicAction.maxParallelConnections; ++i) BasicAction.UsersParallelConnections[Guid.NewGuid().ToString()].isOccupied = false;
            if(BasicAction.maxParallelConnections > BasicAction.Angels.Length) BasicAction.maxParallelConnections = BasicAction.Angels.Length;
            //for (int i = 0; i < BasicAction.maxParallelConnections; ++i)
            //{
            //    BasicAction.UsersParallelConnections[BasicAction.Angels[i]] = new ConnectionModel
            //    {
            //        isOccupied = false,
            //        last_accessed_Time = default
            //    };
            //}
            BasicAction.ExpireTimeSpan = new TimeSpan(BasicAction.AuthModel?.Expiry?[0] ?? 0, BasicAction.AuthModel?.Expiry?[1] ?? 20, BasicAction.AuthModel?.Expiry?[2] ?? 10);
            int k = 90;
            k += 90;

            //BasicAction.ConArtist = ConfigurationManager.ConnectionStrings["ConArtist"].ConnectionString;
            //if (String.IsNullOrEmpty(BasicAction.ConArtist))
            //{
            //    BasicAction.ConArtist = "Server=localhost; Database=wce; Uid=root; Pwd=root@123; Pooling=True; MinimumPoolSize=10; maximumpoolsize=50;charset=utf8mb4";
            //}

            //BasicAction.UploadFolder = ConfigurationManager.AppSettings["UploadFolder"];
            //if (String.IsNullOrEmpty(BasicAction.UploadFolder)) BasicAction.UploadFolder = "~/Content/Data/Uploads/";

            //BasicAction.Profile = ConfigurationManager.AppSettings["Profile"];
            //if (String.IsNullOrEmpty(BasicAction.Profile)) BasicAction.Profile = "~/Content/Profile/";

            //BasicAction.API_KEY = ConfigurationManager.AppSettings["API_KEY"];
            //if (String.IsNullOrEmpty(BasicAction.API_KEY)) BasicAction.API_KEY = "{031B7DF9-863E-4C38-B393-0DD0DD3B57F1}";

            //BasicAction.PowerBiFolder = ConfigurationManager.AppSettings["PowerBiFolder"];
            //if (String.IsNullOrEmpty(BasicAction.PowerBiFolder)) BasicAction.PowerBiFolder = @"C:\WOI\Daily SQL\dfq\csv\";
            //if (!Directory.Exists(BasicAction.PowerBiFolder)) Directory.CreateDirectory(BasicAction.PowerBiFolder);
        }
    }
    public static class SessionValues
    {
        public static string? Name
        {
            get { return BasicAction.contextAccessor.HttpContext?.Session.GetString("UserName"); }
            set { BasicAction.contextAccessor.HttpContext?.Session.SetString("UserName", String.IsNullOrEmpty(value) ? String.Empty : value); }
        }
        public static string? Mail
        {
            get { return BasicAction.contextAccessor.HttpContext?.Session.GetString("UserEmail"); }
            set { BasicAction.contextAccessor.HttpContext?.Session.SetString("UserEmail", String.IsNullOrEmpty(value) ? String.Empty : value); }
        }
        public static String TempPWD
        {
            get { return BasicAction.contextAccessor.HttpContext.Session.GetString("TempPWD") as String; }
            set { BasicAction.contextAccessor.HttpContext.Session.SetString("TempPWD", String.IsNullOrEmpty(value) ? String.Empty : value); }
        }
        public static string? TempUserEmail
        {
            get { return BasicAction.contextAccessor.HttpContext?.Session.GetString("TempUserEmail"); }
            set { BasicAction.contextAccessor.HttpContext?.Session.SetString("TempUserEmail", String.IsNullOrEmpty(value) ? String.Empty : value); }
        }
        public static int? UserId
        {
            get
            {
                var theVal = BasicAction.contextAccessor.HttpContext?.Session.GetInt32("UserID");
                return theVal.HasValue ? theVal : -1;
            }
            set { BasicAction.contextAccessor.HttpContext?.Session.SetInt32("UserID", value.HasValue ? value.Value : -1); }
        }
        public static string? UserRole
        {
            get { return BasicAction.contextAccessor.HttpContext?.Session.GetString("UserRole"); }
            set { BasicAction.contextAccessor.HttpContext?.Session.SetString("UserRole", String.IsNullOrEmpty(value) ? String.Empty : value); }
        }

        public static string ConnectionId
        {
            get { return BasicAction.contextAccessor.HttpContext?.Session.GetString("connectionId"); }
            set { BasicAction.contextAccessor.HttpContext?.Session.SetString("connectionId", String.IsNullOrEmpty(value) ? String.Empty : value); }
        }
    }
}
