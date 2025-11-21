using System.Data;
using Utils;
using Models;
using DAL;
using BAL;
using System.Text;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Xml.Linq;
using Cryptography;
namespace CRLManager.BAL
{
    public class UserBAL
    {
        // user management 
        //add user part
        public static int AddUser(string mail, string pwd, string name, string role)
        {
            var dt = DataAccessLayer.GetDataTable(SqlStatement.GetUser, new { mail = mail });
            if (dt.Rows.Count > 0) return -2;
            return DataAccessLayer.ExecuteNonQuery(SqlStatement.AddUser, new { mail = mail, pwd = pwd, is_default = 1, name = name, roles = role });
        }
        public static DataTable GetAllUsers()
        {
            var dt = DataAccessLayer.GetDataTable(SqlStatement.GetAllUsers.Replace("_CURRENT_USER_ID_", SessionValues.UserId.ToString()));
            DataColumn Col = dt.Columns.Add("pwd");

            Col.SetOrdinal(3);// to put the column in position 0;            
            return dt;
        }
        public static bool DeleteUser(string user_id)
        {
            return true;
        }

        public static int UpdateUserInfo(int id, string name, string mail, string pwd, string role, int is_default = 0, bool encrypt = true)
        {
            var dt = DataAccessLayer.GetDataTable(SqlStatement.GetUserById, new { id = id });
            if (dt.Rows.Count != 1) return -1;
            if (string.IsNullOrEmpty(name)) pwd = dt.Rows[0]["name"] as string;
            if (string.IsNullOrEmpty(pwd)) pwd = dt.Rows[0]["pwd"] as string;
            else
            {
                //user has give a password
                if (encrypt) pwd = AESEncryptDecrypt.AESEncrypt(pwd, BasicAction.AESKey, BasicAction.iv);
            }
            if (string.IsNullOrEmpty(role)) role = dt.Rows[0]["roles"] as string;
            if (string.IsNullOrEmpty(mail)) mail = dt.Rows[0]["mail"] as string;
            return DataAccessLayer.ExecuteNonQuery(SqlStatement.UpdateUserInfo, new { id = id, name = name, mail = mail, pwd = pwd, role = role, is_default = is_default });
        }

        public static object GetCurrentUser()
        {
            if (string.IsNullOrEmpty(SessionValues.Mail)) return null;
            var CurrentUser = new
            {
                mail = SessionValues.Mail,
                name = SessionValues.Name,
                role = SessionValues.UserRole,
                id = SessionValues.UserId
            };
            return (object)CurrentUser;
        }
        public static DataTable GetUserBySid(string sid)
        {
            return DataAccessLayer.GetDataTable(SqlStatement.GetUserBySid, new { sid = sid });
        }
        public static DataTable GetUserByMailAndSessionId(string mail, string sid)
        {
            return DataAccessLayer.GetDataTable(SqlStatement.GetUserByMailAndSessionId, new { mail = mail, sid = sid });
        }
        public static int UpdateSidStatus(int status, string sid)
        {
            return DataAccessLayer.ExecuteNonQuery(SqlStatement.UpdateSidStatus, new { sid = sid, status = status });
        }
        public static int UpdateSidStatusByMailId(string sid, int status, string mail)
        {
            return DataAccessLayer.ExecuteNonQuery(SqlStatement.UpdateSidStatusByMailId, new { sid = sid, status = status, mail = mail });
        }
        public static int UpdateSidStatusById(string sid, int status, long id)
        {
            return DataAccessLayer.ExecuteNonQuery(SqlStatement.UpdateSidStatusById, new { sid = sid, status = status, id = id });
        }
        public static DataTable GetUserByID(long id)
        {
            return DataAccessLayer.GetDataTable(SqlStatement.GetUserByID, new { id = id });
        }
    }
}
