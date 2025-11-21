using System.Data;
using System.Security.Cryptography.X509Certificates;
using Utils;
using Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Pkcs;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.X509;
using System.Diagnostics.PerformanceData;


namespace BAL
{
    using DAL;
    using System.Security.Cryptography.X509Certificates;
    using Utils;
    using Models;
    using System.IO;
    using Microsoft.AspNetCore.Mvc;
    using System.Runtime.ConstrainedExecution;
    using Newtonsoft.Json;
    using System.Text;
    using Cryptography;
    using System.Diagnostics;

    public enum LogInType { DefaultLogIn, RealLogIn, LogInFailed, CowDung, ChangePasswordFailed, AlreadyLoggedIn };
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Usage", "CA2200:Rethrow to preserve stack details", Justification = "Not production code.")]

    public class BusinessLayer
    {
        public static LogInType DoLogin(string pwd, string mail, out long id, out string roles, out string name)
        {
            id = -1; roles = null; name = null;
            try
            {
                String pwd_enc = AESEncryptDecrypt.AESEncrypt(pwd, BasicAction.AESKey, BasicAction.iv);
                var dt = DataAccessLayer.GetDataTable(SqlStatement.VerifyUser, new { mail = mail, pwd_unenc = pwd, pwd_enc = pwd_enc });
                if (dt.Rows.Count <= 0) return LogInType.LogInFailed;
                int is_default = (int)dt.Rows[0]["is_default"];
                name = dt.Rows[0]["name"] as String;
                roles = dt.Rows[0]["roles"] as String;
                id = (long)dt.Rows[0]["id"];
                if (1 == is_default) return LogInType.DefaultLogIn;
                return LogInType.RealLogIn;
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error during login: {ex.Message}");
                throw;
            }
        }
        public static DataTable GetUserInfo(string? mail)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("id");
            dt.Columns.Add("name");
            dt.Columns.Add("mail");
            dt.Columns.Add("roles");
            dt.Rows.Add(SessionValues.UserId, SessionValues.Name, SessionValues.Mail, SessionValues.UserRole);
            return dt;
        }
        // Part of Certificate Parsing
        private static string GetExtension(X509Certificate2 cert, string oid)
        {
            var extension = cert.Extensions[oid];
            return extension != null ? extension.Format(true) : string.Empty;
        }

        // Part of Certificate Parsing 
        private static string CleanIdentifier(string Identifier)
        {
            if (string.IsNullOrWhiteSpace(Identifier))
            {
                return string.Empty;
            }

            string cleanedIdentifier = Identifier.Replace("KeyID=", "").Trim();
            return cleanedIdentifier.Trim();
        }

        // Part of certificate Parsing 
        private static string CleanSpace(string Identifier)
        {
            if (string.IsNullOrWhiteSpace(Identifier))
            {
                return string.Empty;
            }
            string CleanSpace = Identifier.Replace("                                                  ", "").Trim();
            return CleanSpace.Trim();
        }


        // new code for trust store all the files

       
        private static void SaveFileAsPemWithOpenSSL(IFormFile file, string destinationPath, string opensslPath)
        {
            // Temporary file to store the input certificate
            string tempFilePath = Path.GetTempFileName();

            try
            {
                // Save the uploaded file as a temporary file
                using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }

                // Build the OpenSSL command to convert to PEM
                var arguments = $"x509  -in \"{tempFilePath}\"  -out \"{destinationPath}\"";

                // Start the OpenSSL process
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = opensslPath,
                        Arguments = arguments,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };

                process.Start();
                process.WaitForExit();

                // Check for errors during conversion
                if (process.ExitCode != 0)
                {
                    string errorOutput = process.StandardError.ReadToEnd();
                    throw new Exception($"OpenSSL error: {errorOutput}");
                }
            }
            catch (Exception ex)
            {
                string srt = ex.ProcessException();
                //throw new Exception($" {srt}");
                throw new Exception($"Failed to convert certificate to PEM: {srt}");
            }
            finally
            {
                // Delete the temporary file
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                }
            }
        }

        

        //public static bool SPKISaveCertificate(SPKICertificateData certificateData)
        //{
        //    try
        //    {
        //        string sql = SqlStatement.SPKIInsertSingleCertificate;
        //        var parameters = new
        //        {
        //            Issuer = certificateData.Issuer,
        //            valid_from = certificateData.valid_from,
        //            valid_to = certificateData.valid_to,
        //            subject_key_identifier = certificateData.subject_key_identifier,
        //            authority_key_identifier = certificateData.authority_key_identifier,
        //            distribution_point = certificateData.distribution_point,
        //            basic_constraints_subject_type = certificateData.basic_constraints_subject_type,
        //            basic_constraints_path_length_constraint = certificateData.basic_constraints_path_length_constraint,
        //            project_id = certificateData.projectIdupload,
        //            certificate_name = certificateData.certificate_name,
        //            certificate_type = certificateData.certificate_type,
        //            Subject = certificateData.subject
        //        };
        //        int rowsAffected = DataAccessLayer.ExecuteNonQuery(sql, parameters);
        //        return rowsAffected > 0;
        //    }
        //    catch (Exception ex)
        //    {
        //        string srt = ex.ProcessException();
        //        throw new Exception("Error saving certificate in Business Layer.");
        //    }
        //}
        //// Getting Previous Certifiacte for chain verification 
        


        // Checking URL working status of CRL
        public static async Task<bool> CheckDistributionPointAsync(string distributionPoint)
        {
            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = await httpClient.GetAsync(distributionPoint);
                    return response.IsSuccessStatusCode;
                }
                catch
                {
                    return false;
                }
            }
        }

        // Get the Certificate Ids to display and give input s
        public static async Task<List<string>> GetCertificateIdsAsync()
        {
            return await DataAccessLayer.GetCertificateIdsAsync();
        }

        // Getting predefined  download time periods to display and select to give input in configuration Section 
        public static async Task<List<string>> GetTimeSlotsAsync()
        {

            var dataTable = await Task.Run(() => DataAccessLayer.GetDataTable(SqlStatement.GetTimeSlots));


            List<string> timeSlots = new List<string>();
            foreach (DataRow row in dataTable.Rows)
            {
                timeSlots.Add(row["time"].ToString());
            }


            return timeSlots;
        }

        // Getting predefined  certificate ids to display and select to give input in configuration Section 






        // Process the .p7b file (Multple Certificate Upload usecase)
        

        // Convert Certificate bundle format .p7b to .pem (MultiPem file)
        private static string ConvertP7bToPem(string p7bFilePath)
        {
            var pemFilePath = p7bFilePath.Replace(".p7b", ".pem");
            var opensslPath = @"C:\git\DownloadCRLs\otpkicrlmanager\MyOpenSSL\OpenSSL\bin\openssl.exe";
            var processStartInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = opensslPath,
                Arguments = $"pkcs7  -print_certs -in \"{p7bFilePath}\" -out \"{pemFilePath}\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            var process = System.Diagnostics.Process.Start(processStartInfo);
            process.WaitForExit();
            if (process.ExitCode != 0)
            {
                processStartInfo.Arguments = $"pkcs7 -inform der -print_certs -in \"{p7bFilePath}\" -out \"{pemFilePath}\"";
                process = System.Diagnostics.Process.Start(processStartInfo);
                process.WaitForExit();
            }
            return pemFilePath;
        }

        // Split Multi-PEM file to single PEM certificate 
        private static List<string> SplitPemFile(string pemFilePath)
        {
            var pemFiles = new List<string>();
            //var certIndex = 0;
            var tempFolder = Path.GetDirectoryName(pemFilePath);
            var pemFileContent = File.ReadAllText(pemFilePath);
            var pemCerts = pemFileContent.Split(new[] { "-----END CERTIFICATE-----" }, StringSplitOptions.RemoveEmptyEntries);

            int certIndex = 0;
            foreach (var pemCert in pemCerts)
            {
                if (!string.IsNullOrWhiteSpace(pemCert))
                {
                    var certContent = pemCert.Trim() + "\n-----END CERTIFICATE-----";
                    if (certContent.Contains("-----BEGIN CERTIFICATE-----"))
                    {
                        var certLines = certContent.Split('\n');
                        var filteredLines = new List<string>();
                        foreach (var line in certLines)
                        {
                            if (!line.StartsWith("subject=") && !line.StartsWith("issuer="))
                            {
                                filteredLines.Add(line);
                            }
                        }
                        var cleanCertContent = string.Join("\n", filteredLines);
                        var certFilePath = Path.Combine(tempFolder, $"cert{certIndex++}.pem");
                        File.WriteAllText(certFilePath, cleanCertContent);
                        pemFiles.Add(certFilePath);
                    }
                }
            }

            return pemFiles;
        }

       

        // Part of parsing 
        private static string GetMultiExtension(X509Certificate2 cert, string oid)
        {
            var extension = cert.Extensions[oid];
            if (extension != null)
            {
                return extension.Format(true).Replace("KeyId=", "").Replace(" ", "").Trim();
            }
            return string.Empty;
        }

       

        // Clear Temp TrustStore Table After the process
        public static bool ClearTruststoreTemp()
        {
            try
            {
                string sql = SqlStatement.ClearTruststoreTemp;
                string rowsAffected = DataAccessLayer.ExecuteScalar(sql);
                return !string.IsNullOrEmpty(rowsAffected);
            }
            catch (Exception ex)
            {
                string srt = ex.ProcessException();
                throw new Exception("Error occured in deleting temp table of truststore.");
            }

        }

        

        // Copy Temp TrustStore Certificate Table to Main Trust Store table After all certificate chain verifivcate 
        public static bool CopyCertificatesToTrustStoreRoot(string projectIdupload)
        {
            try
            {
                string sql = SqlStatement.CopyCertificatesToTrustStoreRoot;
                var parameters = new
                {
                    projectIdupload
                };
                int rowsAffected = DataAccessLayer.ExecuteNonQuery(sql, parameters);
                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                string srt = ex.ProcessException();
                ApplicationLogs($"Error inserting project: {srt}", "ERROR");
                throw new Exception("Error saving certificate in Business Layer.");
            }
        }
        public static bool DPKICopyCertificatesToTrustStoreRoot(string project_id, string pkiType)
        {
            string tableName = pkiType == "PKI1" ? "pki_one_trust_store" : "pki_two_trust_store";
            try
            {
                string sql = $"INSERT INTO {tableName} (project_id, issuer, last_update, valid_from, valid_to,subject, subject_key_identifier,authority_key_identifier, basic_constraints_subject_type,basic_constraints_path_length_constraint, certificate_type, certificate_rank) SELECT @project_id, issuer, last_update, valid_from, valid_to,subject, subject_key_identifier, authority_key_identifier, basic_constraints_subject_type,basic_constraints_path_length_constraint, certificate_type, certificate_rank FROM truststore_temp ORDER BY certificate_rank ASC";
                var parameters = new
                {
                    project_id
                };
                int rowsAffected = DataAccessLayer.ExecuteNonQuery(sql, parameters);
                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                string srt = ex.ProcessException();
                throw new Exception("Error saving certificate in Business Layer.");
            }
        }

        // Clear End Entity Certificate from table 
        public static bool ClearEndEntityCertificate()
        {
            try
            {
                string sql = SqlStatement.ClearEndEntityCertificate;
                string rowsAffected = DataAccessLayer.ExecuteScalar(sql);
                return !string.IsNullOrEmpty(rowsAffected);
            }
            catch (Exception ex)
            {
                string srt = ex.ProcessException();
                throw new Exception("Error occured in deleting end entity certificate.");
            }
        }

        

        // Update certificate type and certificate rank to the temp trust store table after validation of each certificate
        public static bool UpdateCertificateTypeAndRank(string subject_key_identifier, string certificate_type, int certificate_rank)
        {
            try
            {
                string sql = SqlStatement.UpdateCertificateTypeAndRank;
                var parameters = new
                {
                    certificate_type,
                    subject_key_identifier,
                    certificate_rank
                };
                int rowAffected = DataAccessLayer.ExecuteNonQuery(sql, parameters);
                return rowAffected > 0;
            }
            catch (Exception ex)
            {
                throw;
            }
        }





        // resource



        //public static ResourceUsage GetResourceUsage()
        //{
        //    var resourceUsage = new ResourceUsage();

        //    // Get CPU usage
        //    using (var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total"))
        //    {
        //        // Give the counter time to load (this is necessary to get an accurate reading)
        //        cpuCounter.NextValue();
        //        System.Threading.Thread.Sleep(500); // Wait half a second
        //        resourceUsage.CpuUsage = cpuCounter.NextValue();
        //    }

        //    // Get memory usage of the current process
        //    using (var process = Process.GetCurrentProcess())
        //    {
        //        // Memory usage in MB
        //        resourceUsage.MemoryUsage = process.PrivateMemorySize64 / (1024 * 1024);
        //    }

        //    return resourceUsage;
        //}

        

        // log system

        public static DataTable GetLogs()
        {
            try
            {
                return DataAccessLayer.GetDataTable(SqlStatement.GetApplicationLogs);
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching Configuration", ex);
            }
        }
        public static void ApplicationLogs(string error_message, string event_type)
        {
            try
            {
                string sql = SqlStatement.ApplicationLogs;
                var parameters = new
                {
                    error_message = error_message,
                    event_type = event_type,

                };
                DataAccessLayer.ExecuteNonQuery(sql, parameters);

            }
            catch (Exception ex)
            {
                string srt = ex.ProcessException();
                throw new Exception("Error saving certificate in Business Layer.");
            }
        }


        public static DataTable GetTheOnlyProject() { return DataAccessLayer.GetDataTable(SqlStatement.GetTheOnlyProject); }


    }
}