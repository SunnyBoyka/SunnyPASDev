using BAL;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Formatters;
using Models;
using Newtonsoft.Json;
using System.Reflection;
using System.Security.Claims;
using Utils;

namespace MinimalOverflow.Controllers
{
    public partial class HomeController : Controller
    {
        [AllowAnonymous]

        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated) return RedirectToAction("Index", "Home");
            return View();
        }
        [AllowAnonymous]
        public async Task<string> doLogin()
        {
            //var AnonymousMethods =
            //this.GetType().GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance)
            //    .Where(mi => null != mi.GetCustomAttribute(typeof(AllowAnonymousAttribute), true)).Select(mi => mi.Name.ToLower()).ToList();

            string? pwd = Request.Form["pwd"];
            string? mail = Request.Form["mail"];
            if (String.IsNullOrEmpty(pwd) || String.IsNullOrEmpty(mail)) return LogInType.CowDung.ToString();
            long id = -1; string role; string name;
            BAL.LogInType lt = BusinessLayer.DoLogin(pwd, mail, out id, out role, out name);

            //if (SessionValues.ConnectionId != null) return LogInType.RealLogIn.ToString();

            //BAL.LogInType lt = LogInType.RealLogIn;
            switch (lt)
            {
                case LogInType.RealLogIn:
                    SessionValues.Mail = mail;
                    SessionValues.UserId = (int)id;
                    SessionValues.UserRole = role;
                    SessionValues.Name = name;
                    this.CleanUpStaleConnectionsForThisUserMail();
                    List<ConnectionModel> ListOfConnectionModels = null;
                    if (!BasicAction.UsersParallelConnections.TryGetValue(SessionValues.Mail, out ListOfConnectionModels))
                    {
                        ListOfConnectionModels = new List<ConnectionModel>();
                        SessionValues.ConnectionId = Guid.NewGuid().ToString();
                        ListOfConnectionModels.Add(new ConnectionModel()
                        {
                            ConnectionID = SessionValues.ConnectionId,
                            isOccupied = true,
                            last_accessed_Time = DateTime.Now
                        });
                        BasicAction.UsersParallelConnections[SessionValues.Mail] = ListOfConnectionModels;
                    }
                    else
                    {
                        if (ListOfConnectionModels.Count >= BasicAction.maxParallelConnections) return LogInType.AlreadyLoggedIn.ToString();
                        else
                        {
                            if (string.IsNullOrEmpty(SessionValues.ConnectionId))
                            {
                                SessionValues.ConnectionId = Guid.NewGuid().ToString();
                                ListOfConnectionModels.Add(new ConnectionModel()
                                {
                                    ConnectionID = SessionValues.ConnectionId,
                                    isOccupied = true,
                                    last_accessed_Time = DateTime.Now
                                });
                            }
                            else
                            {
                                //The below if else may never arise
                                if (ListOfConnectionModels.Any(cm => cm.ConnectionID == SessionValues.ConnectionId))
                                {
                                    //why log in to the same user again, let us ignore
                                }
                                else
                                {
                                    //SessionValues.ConnectionId does not match any of the ConnectionID in ListOfConnectionModels
                                    if (ListOfConnectionModels.Count >= BasicAction.maxParallelConnections) return LogInType.AlreadyLoggedIn.ToString();
                                    else
                                    {
                                        ListOfConnectionModels.Add(new ConnectionModel()
                                        {
                                            ConnectionID = SessionValues.ConnectionId,
                                            isOccupied = true,
                                            last_accessed_Time = DateTime.Now
                                        });
                                    }
                                }
                            }
                        }
                    }

                    var userClaims = new List<Claim>()
                    {
                        new Claim(ClaimTypes.Name, mail),
                        new Claim(ClaimTypes.Role, role)
                        //new Claim(ClaimTypes.Email, "anet@test.com"),
                    };
                    var YourIdentity = new ClaimsIdentity(userClaims, "User Identity");
                    var userPrincipal = new ClaimsPrincipal(new[] { YourIdentity });
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, userPrincipal);
                    string userName = User.Identity.Name;
                    //HttpContext.SignInAsync(userPrincipal);
                    //RedirectToAction("Index", "Home");
                    return lt.ToString();
                case LogInType.DefaultLogIn:
                    SessionValues.UserId = (int)id;
                    SessionValues.Name = name;
                    SessionValues.TempUserEmail = mail;
                    SessionValues.TempPWD = pwd;
                    SessionValues.UserRole = role;
                    return lt.ToString();
            }
            return LogInType.LogInFailed.ToString();
        }
        public void CleanUpStaleConnectionsForThisUserMail()
        {
            List<ConnectionModel> ListOfConnectionModels = null;
            if (!BasicAction.UsersParallelConnections.TryGetValue(SessionValues.Mail, out ListOfConnectionModels)) return;
            List<int> ConnectionsIndexToBeDeleted = new List<int>();
            for (int i = 0; i < ListOfConnectionModels.Count; i++)
            {
                if ((DateTime.Now - ListOfConnectionModels[i].last_accessed_Time) >= BasicAction.ExpireTimeSpan)
                {
                    ConnectionsIndexToBeDeleted.Add(i);
                }
            }
            for (int i = 0; i < ConnectionsIndexToBeDeleted.Count; i++) ListOfConnectionModels.RemoveAt(ConnectionsIndexToBeDeleted[i]);
        }
        public ActionResult LogOff()
        {
            List<ConnectionModel> ListOfConnectionModels = null;
            if (!String.IsNullOrEmpty(SessionValues.Mail))
            {
                if (BasicAction.UsersParallelConnections.TryGetValue(SessionValues.Mail, out ListOfConnectionModels))
                {
                    for (int i = 0; i < ListOfConnectionModels.Count; i++)
                    {
                        if (ListOfConnectionModels[i].ConnectionID == SessionValues.ConnectionId)
                        {
                            ListOfConnectionModels[i].isOccupied = false;
                            ListOfConnectionModels[i].last_accessed_Time = default;
                        }
                    }
                }
            }
            HttpContext.SignOutAsync();
            Response.Cookies.Delete("Wonderful");
            HttpContext.Session.Clear();
            return Redirect("~/Home/Login#sign_in");
        }
        [AllowAnonymous]
        public string GetSessionID()
        {
            return BasicAction.contextAccessor.HttpContext?.Session.Id;
        }
        public String? SubmitProfileImage()
        {
            if (HttpContext.Request.Form.Files.Count <= 0) return null;
            try
            {
                //String file_name = Request.Files[0].FileName; //User.Identity.Name is actually mail
                String file_name = HttpContext?.User?.Identity?.Name + ".jpg";
                //string? VirtualImgDirectory = @"/Content/Profile" + Url.Content("~") + @"/" + HttpContext?.User?.Identity?.Name + @"/";
                string? VirtualImgDirectory = BasicAction.VirtualImgDirectory?.Replace("~", Url.Content("~")).Replace("_CURRRENT_USER_", HttpContext?.User?.Identity?.Name);
                if (String.IsNullOrEmpty(VirtualImgDirectory)) return null;
                string? uploadDirectory = ThepathFinder?.MapPath(VirtualImgDirectory);
                if (String.IsNullOrEmpty(uploadDirectory)) return null;
                if (uploadDirectory != null && !Directory.Exists(uploadDirectory)) Directory.CreateDirectory(uploadDirectory);

                string filePath = uploadDirectory + file_name;
                var formFile = HttpContext?.Request.Form.Files[0]; if (formFile == null) return null;
                formFile.Save(filePath);
                String SavedFileRelativePath = VirtualImgDirectory + file_name;
                return SavedFileRelativePath + "?" + BasicAction.rand.Next(0, 10000);
            }
            catch (Exception ex) { return ex.ProcessException(); }
        }
        [AllowAnonymous]
        public String? GetUserInfo()
        {
            if (!HttpContext?.User?.Identity?.IsAuthenticated ?? false) return null;
            var dt = BusinessLayer.GetUserInfo(User?.Identity?.Name);

            string? VirtualImgDirectory = BasicAction.VirtualImgDirectory?.Replace("~", Url.Content("~")).Replace("_CURRRENT_USER_", HttpContext?.User?.Identity?.Name);
            if (String.IsNullOrEmpty(VirtualImgDirectory)) return null;
            string? physicalDir = ThepathFinder?.MapPath(VirtualImgDirectory);
            if (physicalDir == null) return JsonConvert.SerializeObject(dt);
            if (!Directory.Exists(physicalDir)) Directory.CreateDirectory(physicalDir);
            String[] files = System.IO.Directory.GetFiles(physicalDir);
            if (files != null && files.Length > 0)
            {
                dt.Columns.Add("profileImagePath");
                dt.Rows[0]["profileImagePath"] = System.IO.Path.Combine(VirtualImgDirectory, System.IO.Path.GetFileName(files[0]));
            }
            return JsonConvert.SerializeObject(dt);
        }
    }
}
