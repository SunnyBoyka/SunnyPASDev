using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    using BAL;
    using MinimalOverflow;
    using MinimalOverflow.Controllers;
    using Models;
    using Newtonsoft.Json;
    using Npgsql;
    using System.Data;
    using System.Web;
    using Utils;

    //DataBase name, schema name , table name and column name HAVE TO BE IN SMALL LETTERS.
    public static class DataAccessLayer
    {
        private static string GetConnectionStringg()
        {
            return "Host=localhost;Port=5432;Database=CRLREFACT;Username=postgres;Password=root@123;Pooling=True;MinPoolSize=1;MaxPoolSize=20;";
            // return "Host=10.108.188.90;Port=5432;Database=CRLREFACT;Username=postgres;Password=root@123;Pooling=True;MinPoolSize=1;MaxPoolSize=20;";
        }

        // public static string conString = "Host=localhost;Port=5432;Database=dvdrental;Username=postgres;Password=root@123;Pooling=True;MinPoolSize=1;MaxPoolSize=20";
        public static void AdaptTheCommand(NpgsqlCommand command, object param)
        {
            if (param == null) return;
            var pInfos = param.GetType().GetProperties();
            foreach (var pInfo in pInfos)
            {
                var pVal = pInfo.GetValue(param);

                // command.Parameters.AddWithValue("@" + pInfo.Name, "%"+pVal+"%");
                if (pVal == null) pVal = DBNull.Value;
                command.Parameters.AddWithValue("@" + pInfo.Name, pVal);
            }

            // String str = "jello";
        }

        public static string GetConnectionString()
        {
            string? who = BasicAction.contextAccessor.HttpContext?.Request?.PathBase.ToString();
            string? conStr = Tenant.GetConnectionString(BasicAction.AllTenants, Utilities.GetFirstTenant(who));

            // if (conStr == null) return DataAccessLayer.conString;
            if (conStr == null) return String.Empty; // there is no fallback , this is done on purpose to see if we get a crash anytime
            return conStr;
        }
        /// <summary>
        /// Example of param
        /// var param = new
        ///    {
        ///        @actor_id = 1,
        ///        @first_name = "penelope"
        ///    };
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public static DataTable GetDataTable(string sql, Object param)
        {
            DataTable dt = new DataTable();
            using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
            {
                cnn.Open();
                using (NpgsqlCommand mycommand = new NpgsqlCommand(sql, cnn))
                {
                    DataAccessLayer.AdaptTheCommand(mycommand, param);
                    using (NpgsqlDataAdapter adapter = new NpgsqlDataAdapter(mycommand))
                    {
                        adapter.AcceptChangesDuringFill = true;
                        adapter.Fill(dt);
                        adapter.Dispose();
                        cnn.Close();
                        return dt;
                    }
                }
            }
        }
        public static DataTable GetDataTable(string sql)
        {
            DataTable dt = new DataTable();
            using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
            {
                cnn.Open();
                using (NpgsqlCommand mycommand = new NpgsqlCommand(sql, cnn))
                {
                    using (NpgsqlDataAdapter adapter = new NpgsqlDataAdapter(mycommand))
                    {
                        adapter.AcceptChangesDuringFill = true;
                        adapter.Fill(dt);
                        adapter.Dispose();
                        cnn.Close();
                        return dt;
                    }
                }
            }
        }

        public static DataSet GetDataSet(List<Tuple<string, object>> SqlAndParams)
        {
            DataSet ds = new DataSet();
            using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
            {
                cnn.Open();
                using (NpgsqlCommand mycommand = new NpgsqlCommand())
                {
                    using (NpgsqlDataAdapter adapter = new NpgsqlDataAdapter())
                    {
                        foreach (var SqlAndParam in SqlAndParams)
                        {
                            DataTable dt = new DataTable();
                            String sql = SqlAndParam.Item1;
                            mycommand.CommandText = sql;
                            if (mycommand.Connection == null) mycommand.Connection = cnn;
                            if (SqlAndParam.Item2 != null) DataAccessLayer.AdaptTheCommand(mycommand, SqlAndParam.Item2);
                            adapter.SelectCommand = mycommand;
                            adapter.AcceptChangesDuringFill = true;
                            adapter.Fill(dt);
                            adapter.Dispose();
                            cnn.Close();
                            ds.Tables.Add(dt);
                        }
                    }
                }
            }

            return ds;
        }

        public static DataTable GetDataTable(NpgsqlCommand mycommand)
        {
            DataTable dt = new DataTable();
            using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
            {
                cnn.Open();
                mycommand.Connection = cnn;
                using (NpgsqlDataAdapter adapter = new NpgsqlDataAdapter(mycommand))
                {
                    adapter.AcceptChangesDuringFill = true;
                    adapter.Fill(dt);
                    adapter.Dispose();
                    cnn.Close();
                    mycommand.Dispose();
                    return dt;
                }
            }
        }

        public static int InsertSQL(string sql)
        {
            using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
            {
                cnn.Open();
                using (NpgsqlCommand mycommand = new NpgsqlCommand(sql, cnn))
                {
                    int value = mycommand.ExecuteNonQuery();
                    cnn.Close();
                    return value;
                }
            }
        }

        public static string ExecuteScalar(string sql, Object param)
        {
            using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
            {
                cnn.Open();
                using (NpgsqlCommand mycommand = new NpgsqlCommand(sql, cnn))
                {
                    DataAccessLayer.AdaptTheCommand(mycommand, param);
                    object value = mycommand.ExecuteScalar();
                    cnn.Close();
                    if (value == System.DBNull.Value) return null;
                    if (value != null) return value.ToString();
                    return null;
                }
            }
        }

        public static string ExecuteScalar(string sql)
        {
            using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
            {
                cnn.Open();
                using (NpgsqlCommand mycommand = new NpgsqlCommand(sql, cnn))
                {
                    object value = mycommand.ExecuteScalar();
                    cnn.Close();
                    if (value != null) return value.ToString();
                    return String.Empty;
                }
            }
        }

        public static int ExecuteNonQuery(string sql, Object param = null)
        {
            using (NpgsqlConnection connection = new NpgsqlConnection(GetConnectionString()))
            {
                connection.Open();
                using (NpgsqlCommand command = new NpgsqlCommand(sql, connection))
                {
                    if (param != null) DataAccessLayer.AdaptTheCommand(command, param);
                    int value = command.ExecuteNonQuery();
                    connection.Close();
                    return value;
                }
            }
        }

        public static dynamic ExecuteQuerySingleOrDefault(string sql, object param = null)
        {
            using (var connection = new NpgsqlConnection(GetConnectionString()))
            {
                connection.Open();
                using (var command = new NpgsqlCommand(sql, connection))
                {
                    if (param != null) AdaptTheCommand(command, param);
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new
                            {
                                id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                                user_role = reader["user_role"].ToString(),
                                user_name = reader["user_name"].ToString(),
                                hashed_string = reader["hashed_string"].ToString(),
                                salt = reader["salt"].ToString()
                            };
                        }
                    }
                }
            }
            return null; // No record found
        }

        /// <summary>
        /// Update multiple commands Run_Command status using transaction
        /// </summary>
        /// <param name="commands">List of commands to update</param>
        /// <returns>Number of rows affected, or -1 on error</returns>
        public static int UpdateNMapCommandsRunStatus(List<CommandUpdateModel> commands)
        {
            int rowsAffected = 0;

            try
            {
                if (commands == null || commands.Count == 0)
                    return -1;

                using (NpgsqlConnection cnn = new NpgsqlConnection(GetConnectionString()))
                {
                    cnn.Open();
                    using (var transaction = cnn.BeginTransaction())
                    {
                        try
                        {
                            foreach (var cmd in commands)
                            {
                                using (NpgsqlCommand mycommand = new NpgsqlCommand(SqlStatement.UpdateNMapCommandRunStatus, cnn, transaction))
                                {
                                    var param = new
                                    {
                                        id = cmd.Id,
                                        Run_Command = cmd.RunCommand,
                                        Last_Update = DateTime.Now
                                    };

                                    AdaptTheCommand(mycommand, param);
                                    rowsAffected += mycommand.ExecuteNonQuery();
                                }
                            }

                            transaction.Commit();
                            return rowsAffected;
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            Console.WriteLine($"Error in UpdateCommandsRunStatus DAL transaction: {ex.Message}");
                            return -1;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateNMapCommandsRunStatus DAL: {ex.Message}");
                return -1;
            }
        }



        //-- delete it when tested whole application
        // getting projects
        //public static async Task<List<Project>> GetProjectsAsync()
        //{
        //    var projects = new List<Project>();

        //    using (var cnn = new NpgsqlConnection(GetConnectionStringg()))
        //    {
        //            await cnn.OpenAsync();

        //            // _logger.LogInformation("Database connection opened successfully.");
        //            using (var cmd = new NpgsqlCommand("SELECT project_id, project_name FROM projects", cnn))
        //            {
        //                using (var reader = await cmd.ExecuteReaderAsync())
        //                {
        //                    while (await reader.ReadAsync())
        //                    {
        //                        projects.Add(new Project
        //                        {
        //                            ProjectId = reader.GetString(0),
        //                            ProjectName = reader.GetString(1),
        //                        });
        //                    }
        //                }
        //            }

        //            await cnn.CloseAsync();
        //    }

        //    return projects;
        //}




        //---------------Manage Certificates part--------------//




        // getting project id and names for data loading 
        public static async Task<List<LoadProjectsForCertificate>> GetProjectsIdAsync()
        {
            var projects = new List<LoadProjectsForCertificate>();
            using (var cnn = new NpgsqlConnection(GetConnectionStringg()))
            {
                await cnn.OpenAsync();
                using (var cmd = new NpgsqlCommand("SELECT project_id FROM projects", cnn))
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        projects.Add(new LoadProjectsForCertificate
                        {
                            projectIdupload = reader["project_id"].ToString(),
                            //projectNameupload = reader["project_name"].ToString()
                        });
                    }
                }
            }

            return projects;
        }
        public static async Task<List<LoadDPKIProjectsForCertificate>> GetDPKIProjectsIdAsync()
        {
            var projects = new List<LoadDPKIProjectsForCertificate>();
            using (var cnn = new NpgsqlConnection(GetConnectionStringg()))
            {
                await cnn.OpenAsync();
                using (var cmd = new NpgsqlCommand("SELECT project_id FROM projects", cnn))
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        projects.Add(new LoadDPKIProjectsForCertificate
                        {
                            project_id = reader["project_id"].ToString(),
                            //projectNameupload = reader["project_name"].ToString()
                        });
                    }
                }
            }

            return projects;
        }

        //--- IF TESTED FULLY then only deleted it 
        //public static async Task<string> GetProjectNameAsync(string projectIdupload)
        //{
        //    using (var cnn = new NpgsqlConnection(GetConnectionStringg()))
        //    {
        //        await cnn.OpenAsync();
        //        using (var cmd = new NpgsqlCommand("SELECT project_name FROM projects WHERE project_id = @projectIdupload", cnn))
        //        {
        //            cmd.Parameters.AddWithValue("projectIdupload", projectIdupload);
        //            return (string)await cmd.ExecuteScalarAsync();
        //        }
        //    }
        //}

        //---------------Configuration-----------------//
        public static async Task<List<string>> GetCertificateIdsAsync()
        {
            var certificateIds = new List<string>();

            using (var cnn = new NpgsqlConnection(GetConnectionStringg()))
            {
                await cnn.OpenAsync();

                using (var cmd = new NpgsqlCommand("SELECT certificate_id FROM trust_store_root", cnn))
                {
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            certificateIds.Add(reader.GetString(reader.GetOrdinal("certificate_id")));
                        }
                    }
                }
            }

            return certificateIds;
        }




        public class BulkDataAccessLayer
        {
            [ThreadStatic]
            //public static string conString = "Host=localhost;Username=postgres;Password=root@123;Database=CRLREFACT;Pooling=True;MinimumPoolSize=10;maximumpoolsize=50;";
            public static string conString = "Host=10.108.188.90;Port=5432;Database=CRLREFACT;Username=postgres;Password=root@123;Pooling=True;MinPoolSize=1;MaxPoolSize=20;Include Error Detail=True;";
            [ThreadStatic]
            public static NpgsqlTransaction? transaction = null;
            [ThreadStatic]
            public static NpgsqlCommand? commander = null;
            [ThreadStatic]
            public static NpgsqlConnection? cnn = null;
            [ThreadStatic]
            public static bool isInitialized = false;

            public static int BeginATransactionAndInsertSQL(string sql, Object param)
            {
                if (!isInitialized)
                {
                    if (null == cnn)
                    {
                        cnn = new NpgsqlConnection(conString);
                        cnn.Open();
                    }

                    if (null == commander)
                    {
                        commander = new NpgsqlCommand(sql, cnn);
                        DataAccessLayer.AdaptTheCommand(commander, param);
                    }

                    if (null == transaction) transaction = cnn.BeginTransaction();
                    isInitialized = true;
                }
                else
                {
                    commander.Parameters.Clear();

                    commander.CommandText = sql;

                    DataAccessLayer.AdaptTheCommand(commander, param);

                }

                if (null == commander) return -101;

                // commander.Transaction = transaction;
                return commander.ExecuteNonQuery();
            }

            public static void EndTransaction()
            {
                if (cnn == null || transaction == null) return;
                transaction.Commit();
                if (commander != null) commander.Dispose();
                cnn.Close();
                cnn = null;
                transaction = null;
                commander = null;
                isInitialized = false;

            }
        }
    }
}
