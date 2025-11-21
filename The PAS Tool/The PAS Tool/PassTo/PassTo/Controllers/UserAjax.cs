using BAL;
using CRLManager.BAL;
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
        [AuthorizedRoles(new[] { "admin" })]
        // add the User
        public int AddUser()
        {
            //Get query string parameters
            string mail = Request.Query["mail"];
            string name = Request.Query["name"];
            string role = Request.Query["role"];
            string pwd = Request.Query["pwd"];

            if (string.IsNullOrEmpty(mail) || string.IsNullOrEmpty(name) || string.IsNullOrEmpty(role) || string.IsNullOrEmpty(pwd)) return -1;
            mail = mail.Split('@')[0].Trim(); name = name.Trim(); role = role.Trim(); pwd = pwd.Trim();
            return UserBAL.AddUser(mail, pwd, name, role);
        }
        [AuthorizedRoles(new[] { "admin" })]
        public bool DeleteUser()
        {
            return true;
        }
        /// <summary>
        /// url : ~/Home/UpdateUserInfo
        /// This will be called by either change password, or when user updates his/her own password
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public int UpdateUserInfo()
        {
            bool encrypt = true;
            int is_default = 0;
            //if not authenticated and not have a temporary signin then get out from my mother land
            if (!User.Identity.IsAuthenticated)
            {
                if (string.IsNullOrEmpty(SessionValues.TempPWD)) return -100;
            }
            string id_str = Request.Query["id"];
            if (string.IsNullOrEmpty(id_str)) return -2;
            if (!int.TryParse(id_str, out int id)) return -2;
            if (id <= 0) return -2;
            string pwd = Request.Query["pwd"];
            string name = Request.Query["name"];
            string role = Request.Query["role"];
            string mail = Request.Query["mail"];
            if (SessionValues.TempUserEmail != mail || id != SessionValues.UserId) return -100;

            if (string.IsNullOrEmpty(pwd)) return -3;
            //return UserBAL.UpdateUserInfo(id, name, mail, pwd, role);
            return UserBAL.UpdateUserInfo(id, name, null, pwd, null, is_default, encrypt);
        }
        /// <summary>
        /// url : ~/Home/UpdateUserInfobyAdmin
        /// </summary>
        /// <returns></returns>
        [AuthorizedRoles(new[] { "admin" })]
        public int UpdateUserInfobyAdmin()
        {
            string id_str = Request.Query["id"];
            int id;
            if (string.IsNullOrEmpty(id_str)) return -2;
            if (!int.TryParse(id_str, out id)) return -2;
            if (id <= 0) return -2;
            string is_default_str = Request.Query["is_default"];
            if (string.IsNullOrEmpty(is_default_str)) return -2;
            int is_default = 0;
            if (!int.TryParse(is_default_str, out is_default)) return -2;
            if (is_default < 0 || is_default > 1) return -2; // is_default should be 0 or 1
            string pwd = Request.Query["pwd"];
            string name = Request.Query["name"];
            string role = Request.Query["role"];
            string mail = Request.Query["mail"];
            return UserBAL.UpdateUserInfo(id, name, mail, pwd, role, is_default, false);
        }
        /// <summary>
        /// url: ~/Home/GetCurrentUser
        /// </summary>
        /// <returns></returns>
        public string GetCurrentUser() { return JsonConvert.SerializeObject(UserBAL.GetCurrentUser()); }

        /// <summary>
        /// url: ~/Home/GetAllUsers
        /// </summary>
        /// <returns></returns>
        [AuthorizedRoles(new[] { "admin" })]
        public string GetAllUsers()
        {
            return JsonConvert.SerializeObject(UserBAL.GetAllUsers());
        }

    }
}
