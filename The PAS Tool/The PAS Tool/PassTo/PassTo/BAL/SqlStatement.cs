using System.Runtime.CompilerServices;

namespace BAL
{
    public class SqlStatement
    {
        public static readonly String VerifyUser = @"SELECT * from users WHERE mail = @mail AND (pwd = @pwd_unenc OR pwd = @pwd_enc)";
        public static readonly string UpdateUserInfo = "Update users set pwd = @pwd, mail = @mail, name = @name, roles=@role, is_default = @is_default  where id = @id";
        public static readonly string GetPublishedResult = @"select trust_store_root.issuer, trust_store_root.subject, trust_store_root.which_pki,
                                                         ms_status.* from ms_status 
                                                             inner join configuration
                                                                 on configuration.id = ms_status.configuration_id
                                                             inner join trust_store_root 
                                                                 on configuration.trust_store_root_id = trust_store_root.id
                                                      where trust_store_root.which_pki is @which_pki";
        public static readonly string GetPublishedSinglePKIPEMResult = @"select trust_store_root.issuer, trust_store_root.subject, trust_store_root.which_pki,
                                                         ms_status.* from ms_status 
                                                             inner join configuration
                                                                 on configuration.id = ms_status.configuration_id
                                                             inner join trust_store_root 
                                                                 on configuration.trust_store_root_id = trust_store_root.id
                                                      where trust_store_root.which_pki is @which_pki LIMIT 1";
        public static readonly string GetPublishedMultiPKIPemResult = @"select * from (SELECT trust_store_root.issuer, trust_store_root.subject, trust_store_root.which_pki, ms_status.* FROM ms_status
                                                                        INNER JOIN configuration ON configuration.id = ms_status.configuration_id
                                                                        INNER JOIN trust_store_root ON configuration.trust_store_root_id = trust_store_root.id
                                                                        WHERE trust_store_root.which_pki = 'PKI1' LIMIT 1) as sub1
                                                                                    UNION All  
                                                                        select * from (SELECT trust_store_root.issuer,  trust_store_root.subject,  trust_store_root.which_pki, ms_status.* FROM ms_status 
                                                                        INNER JOIN configuration ON configuration.id = ms_status.configuration_id
                                                                        INNER JOIN trust_store_root ON configuration.trust_store_root_id = trust_store_root.id
                                                                        WHERE trust_store_root.which_pki = 'PKI2' LIMIT 1  ) as sub2";
        // public static readonly string GetPublishedResult = @"select issuer, subject from trust_store_root  where trust_store_root.pki_type = 2";


        public static readonly string InsertSingleCertificate = @"INSERT INTO trust_store_root (issuer,valid_from,valid_to, subject_key_identifier,authority_key_identifier,distribution_point, basic_constraints_subject_type,basic_constraints_path_length_constraint, project_id, certificate_name, certificate_type,     subject  )
                                                                         VALUES ( @issuer,@valid_from, @valid_to,@subject_key_identifier,@authority_key_identifier,@distribution_point, @basic_constraints_subject_type,@basic_constraints_path_length_constraint,(SELECT id FROM projects) ,@certificate_name, @certificate_type,   @subject )";
        public static readonly string SPKIInsertSingleCertificate = @"INSERT INTO trust_store_root (issuer,valid_from,valid_to, subject_key_identifier,authority_key_identifier,distribution_point, basic_constraints_subject_type,basic_constraints_path_length_constraint, project_id, certificate_name, certificate_type,     subject  )
                                                                         VALUES ( @issuer,@valid_from, @valid_to,@subject_key_identifier,@authority_key_identifier,@distribution_point, @basic_constraints_subject_type,@basic_constraints_path_length_constraint, @projectIdupload,@certificate_name, @certificate_type,   @subject )";

        public static readonly string GetCertificateBySubjectKeyIdentifier = @"SELECT * FROM trust_store_root WHERE  subject_key_identifier = @authority_key_identifier AND project_id = @projectIdupload";
        public static readonly string GetTheOnlyProject = @"SELECT * FROM projects";

        //public static readonly string GetCertificateBySubjectKeyIdentifier = @"SELECT * FROM trust_store_root WHERE  subject_key_identifier = @authority_key_identifier ";
        public static readonly string GetCertificateByType = @"SELECT * FROM trust_store_root WHERE project_id = @projectId AND certificate_type = @certificateType";
        public static readonly string InsertProject = @"INSERT INTO projects (project_name, project_id) VALUES (@projectName, @projectId)";
        public static readonly string GetProjects = @"SELECT project_id, project_name FROM projects";
        public static readonly string UpdateProject = @"UPDATE projects SET project_name = @projectName WHERE project_id = @projectId";
        public static readonly string DeleteProject = "DELETE FROM projects WHERE project_id = @projectId";
        public static readonly string GetCertificatesforTable = @"SELECT issuer,valid_from,valid_to, subject_key_identifier, authority_key_identifier,certificate_id,  basic_constraints_subject_type, certificate_name FROM public.trust_store_root";
        public static readonly string GetPKIONECertificatesforTable = @"SELECT issuer,valid_from,valid_to, subject_key_identifier, authority_key_identifier,certificate_id,  basic_constraints_subject_type, certificate_name FROM public.pki_one_trust_store";
        public static readonly string GetPKITWOCertificatesforTable = @"SELECT issuer,valid_from,valid_to, subject_key_identifier, authority_key_identifier,certificate_id,  basic_constraints_subject_type, certificate_name FROM public.pki_two_trust_store";
        public static readonly string DeleteCertificate = "DELETE FROM trust_store_root WHERE certificate_id = @certificateId";
        public static readonly string DeletePKIONECertificate = "DELETE FROM pki_one_trust_store WHERE certificate_id = @certificateId";
        public static readonly string DeletePKITWOCertificate = "DELETE FROM pki_two_trust_store WHERE certificate_id = @certificateId";
        // public static readonly string GetProjectsId = @"SELECT project_id, project_name FROM projects";
        public static readonly string GetProjectsId = @"SELECT  project_name FROM projects";

        public static readonly string GetProjectName = "SELECT project_name FROM projects WHERE project_id = @projectIdupload";
        public static readonly string InsertTempCertForMultiUpload = @"INSERT INTO truststore_temp (issuer, last_update, valid_from, valid_to,
                                                                subject ,subject_key_identifier,authority_key_identifier, basic_constraints_subject_type,
                                                                basic_constraints_path_length_constraint, certificate_name) VALUES (@issuer, NOW(), @valid_from, @valid_to,@subject, @subject_key_identifier,
                                                                   @authority_key_identifier, @basic_constraints_subject_type,@basic_constraints_path_length_constraint, @certificate_name)";
        public static readonly string GetCertificatesFromTemp = "SELECT subject_key_identifier,authority_key_identifier,basic_constraints_subject_type FROM truststore_temp";
        public static readonly string UpdateCertificateTypeAndRank = @"UPDATE truststore_temp SET certificate_type = @certificate_type, certificate_rank = @certificate_rank
                                                                    WHERE subject_key_identifier = @subject_key_identifier";
        public static readonly string CopyCertificatesToTrustStoreRoot = @"INSERT INTO trust_store_root (project_id, issuer, last_update, valid_from, valid_to,subject, subject_key_identifier,
                                                                    authority_key_identifier, basic_constraints_subject_type,basic_constraints_path_length_constraint, certificate_type, certificate_rank)
                                                                    SELECT @projectIdupload, issuer, last_update, valid_from, valid_to,subject, subject_key_identifier, authority_key_identifier, basic_constraints_subject_type,
                                                                    basic_constraints_path_length_constraint, certificate_type, certificate_rank FROM truststore_temp ORDER BY certificate_rank ASC";
        public static readonly string ClearTruststoreTemp = "DELETE FROM truststore_temp";
        public static readonly string ClearEndEntityCertificate = "DELETE FROM trust_store_root where basic_constraints_subject_type LIKE '%End Entity%'";
        public static readonly string GetCertificateIds = "SELECT certificate_id FROM trust_store_root";
        public static readonly string GetTimeSlots = "select time from time_slots";
        public static readonly string loadCertIdConTab = "select certificate_id from trust_store_root ";
        public static readonly string loadPKIONECertIdConTab = "select certificate_id from pki_one_trust_store ";
        public static readonly string loadPKITWOCertIdConTab = "select certificate_id from pki_two_trust_store ";
        public static readonly string InsertConfiguration = @"INSERT INTO configuration (crl_pem_conversion, multi_pem_aggregation, distribution_point, download_period, multi_pem_name,  crl_name,max_attempts, crl_size, certificate_id)
	                                                      VALUES (@crlPEMconversion, @multiPEMaggregation, @distributionPoint, @downloadPeriod, @multiPEMName,  @crlName,@maxAttempts, @crlSize, @certificate_id)";
        public static readonly string InsertPKIONEConfiguration = @"INSERT INTO pki_one_configuration (crl_pem_conversion, multi_pem_aggregation, distribution_point, download_period, multi_pem_name,  crl_name,max_attempts, crl_size, certificate_id)
	                                                      VALUES (@PKI1crlPEMconversion, @PKI1multiPEMaggregation, @PKI1distributionPoint, @PKI1downloadPeriod, @PKI1multiPEMName,  @PKI1crlName,@PKI1maxAttempts, @PKI1crlSize, @PKI1certconfigId)";
        public static readonly string InsertPKITWOConfiguration = @"INSERT INTO pki_two_configuration (crl_pem_conversion, multi_pem_aggregation, distribution_point, download_period, multi_pem_name,  crl_name,max_attempts, crl_size, certificate_id)
	                                                      VALUES (@PKI2crlPEMconversion, @PKI2multiPEMaggregation, @PKI2distributionPoint, @PKI2downloadPeriod, @PKI2multiPEMName,  @PKI2crlName,@PKI2maxAttempts, @PKI2crlSize, @PKI2certconfigId)";
        public static readonly string GetConfiguration = "SELECT  configuration_id, certificate_id, last_update, crl_pem_conversion, multi_pem_aggregation, distribution_point, download_period, multi_pem_name, crl_name,max_attempts, crl_size FROM configuration";
        public static readonly string GetConfigurations = "SELECT  configuration_id,  crl_name FROM configuration";
        public static readonly string GetPKIONEConfiguration = "SELECT  configuration_id, certificate_id, last_update, crl_pem_conversion, multi_pem_aggregation, distribution_point, download_period, multi_pem_name, crl_name,max_attempts, crl_size FROM pki_one_configuration";
        public static readonly string GetPKITWOConfiguration = "SELECT  configuration_id, certificate_id, last_update, crl_pem_conversion, multi_pem_aggregation, distribution_point, download_period, multi_pem_name, crl_name,max_attempts, crl_size FROM pki_two_configuration";
        public static readonly string UpdateConfiguration = @"UPDATE configuration SET certificate_id = @certconfigId,crl_pem_conversion= @crlPEMconversion,
                                                        crl_name = @crlName,max_attempts =@maxAttempts, multi_pem_name = @multiPEMName, download_period = @downloadPeriod,
                                                        distribution_point= @distributionPoint, crl_size= @crlSize,multi_pem_aggregation= @multiPEMaggregation WHERE configuration_id = @configurationId";
        public static readonly string UpdatePKIONEConfiguration = @"UPDATE pki_one_configuration SET certificate_id = @PKI1certconfigId,crl_pem_conversion= @PKI1crlPEMconversion,
                                                        crl_name = @PKI1crlName,max_attempts =@PKI1maxAttempts, multi_pem_name = @PKI1multiPEMName, download_period = @PKI1downloadPeriod,
                                                        distribution_point= @PKI1distributionPoint, crl_size= @PKI1crlSize,multi_pem_aggregation= @PKI1multiPEMaggregation WHERE configuration_id = @PKI1configurationId";
        public static readonly string UpdatePKITWOConfiguration = @"UPDATE pki_two_configuration SET certificate_id = @PKI2certconfigId,crl_pem_conversion= @PKI2crlPEMconversion,
                                                        crl_name = @PKI2crlName,max_attempts =@PKI2maxAttempts, multi_pem_name = @PKI2multiPEMName, download_period = @PKI2downloadPeriod,
                                                        distribution_point= @PKI2distributionPoint, crl_size= @PKI2crlSize,multi_pem_aggregation= @PKI2multiPEMaggregation WHERE configuration_id = @PKI2configurationId";
        public static readonly string DeleteConfiguration = "DELETE FROM configuration WHERE configuration_id = @configuration_id";
        public static readonly string DeletePKIONEConfiguration = "DELETE FROM pki_one_configuration WHERE configuration_id = @configuration_id";
        public static readonly string DeletePKITWOConfiguration = "DELETE FROM pki_two_configuration WHERE configuration_id = @configuration_id";
        public static readonly string ListCRL = "select crl_name from configuration";
        public static readonly string PKI1ListCRL = "select crl_name from pki_one_configuration";
        public static readonly string PKI2ListCRL = "select crl_name from pki_two_configuration";
        public static readonly string UpdateUser = "UPDATE user SET id=?, user_name=?, user_id=?, hashed_string=?, user_role=?, salt=?, last_update=?, update_status=?, user_status= ? WHERE <condition>;";
        public static readonly string DeleteUser = "DELETE FROM users WHERE user_id = @user_id;";
        public static readonly string AddUser = @"INSERT INTO users (name, mail, pwd, is_default, roles) VALUES (@name, @mail, @pwd, @is_default, @roles)";
        public static readonly string UpdateUserPassword = @"UPDATE users SET hashed_string = @hashedpassword, salt = @salt WHERE id = @userid";
        public static readonly string DeleteOperator = "DELETE  ";
        public static readonly string GetUser = @"SELECT * FROM users where mail = @mail";
        public static readonly string GetUserById = @"SELECT * FROM users where id = @id";
        public static readonly string GetUserBySid = @"SELECT * FROM users where sid = @sid";
        public static readonly string GetUserByMailAndSessionId = @"SELECT * FROM users where mail = @mail and sid = @sid";
        public static readonly string GetUserByID = @"SELECT * FROM users where id = @id;";
        public static readonly string GetAllUsers = @"Select id, name, mail, is_default, roles, ins_upd_time from users where id != _CURRENT_USER_ID_ order by id";
        public static readonly string UpdateSidStatus = @"UPDATE users SET sid = @sid, login_status = @status WHERE sid = @sid";
        public static readonly string UpdateSidStatusByMailId = @"UPDATE users SET sid = @sid, login_status = @status WHERE mail = @mail";
        public static readonly string UpdateSidStatusById = @"UPDATE users SET sid = @sid, login_status = @status WHERE id = @id";
        public static readonly string ApplicationLogs = @"INSERT INTO application_logs( event_type,  error_message)	VALUES (@event_type,@error_message);";
        public static readonly string GetApplicationLogs = "SELECT tslog_id, error_message, log_timestamp FROM application_logs";

        // --  sql queries 


        // passtool part
        public static readonly string GetCommands = "select command_name from nmap_commands";
        public static readonly string InsertScanData = @"INSERT INTO scan_data(scan_type,command, created_at,created_by,updated_by,scan_status,scan_result,triggered_by) VALUES (@scan_type,@command, @created_at,@created_by,@updated_by,@scan_status,@scan_result,@triggered_by);";
        public static readonly string GetAllNMapCommands = "SELECT * FROM nmap_commands order by id"; 
        public static readonly string UpdateNMapCommandRunStatus = @"UPDATE nmap_command SET run_command = @Run_Command, last_update = @Last_Update WHERE id = @id";

        // passtool part

    }
}
