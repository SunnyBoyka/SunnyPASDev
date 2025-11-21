using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using MinimalOverflow.Models;
using Newtonsoft.Json;
using System.Data;
using System.Diagnostics;
using Utils;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using System.IO;

namespace MinimalOverflow.Controllers
{
    using BAL;
    using DAL;
    using global::Models;
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Hosting.Server;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CSharp.Syntax;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting.Internal;
    using System;
    using System.Configuration;
    using System.IO;
    using System.Reflection;
    using System.Runtime.ConstrainedExecution;
    using System.Text;

    //https://andrewlock.net/5-ways-to-set-the-urls-for-an-aspnetcore-app/
    [Authorize]
    public partial class HomeController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILogger<HomeController> _logger;
        // public static IHttpContextAccessor? contextAccessor;
        IPathProvider? ThepathFinder;
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string path = context.HttpContext.Request.Path.Value.ToLower();
            if (BasicAction.AnonymousMethods == null)
            {
                BasicAction.AnonymousMethods =
                           this.GetType().GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance)
                .Where(mi => null != mi.GetCustomAttribute(typeof(AllowAnonymousAttribute), true)).Select(mi => mi.Name.ToLower()).ToArray();
            }
            if (BasicAction.AnonymousMethods.Any(m => path.Contains(m)))
            {
                base.OnActionExecuting(context);
                return;
            }
            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                // This is an AJAX request
            }
            else
            {
                // This is a normal request , i.e page request               
            }
            if (SessionValues.ConnectionId != null)
            {
                List<ConnectionModel> ListOfConnectionModels = null;
                if (BasicAction.UsersParallelConnections.TryGetValue(SessionValues.Mail, out ListOfConnectionModels))
                {
                    for (int i = 0; i < ListOfConnectionModels.Count; i++)
                    {
                        if (ListOfConnectionModels[i].ConnectionID == SessionValues.ConnectionId)
                        {
                            ListOfConnectionModels[i].isOccupied = true;
                            ListOfConnectionModels[i].last_accessed_Time = DateTime.Now;
                        }
                    }
                }
            }
            base.OnActionExecuting(context);
        }

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment hostingEnvironment, IPathProvider pathFinder /*, IHttpContextAccessor theContextAccessor*/)
        {
            _logger = logger;
            ThepathFinder = pathFinder;
            // HomeController.contextAccessor = theContextAccessor;
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            // throw new Exception("This is a test exception");
            // HttpContext.SetUserEmail("sesha.sai");
            //string Ten = Utilities.GetFirstTenant(HttpContext.Request.PathBase);            
            ViewBag.sessionId = BasicAction.contextAccessor.HttpContext?.Session.Id;
            return View();
        }
        public IActionResult Publish()
        {
            return View();
        }

        //[AuthorizedRoles(new[] { "admin" })]
        //public IActionResult TrustStore()
        //{
        //    return View();
        //}

        [AuthorizedRoles(new[] { "admin" })]
        public IActionResult UserManagement()
        {
            return View();
        }
        [AuthorizedRoles(new[] { "admin" })]
        public IActionResult Syslog()
        {
            return View();
        }
        public IActionResult OneTimeSetUp()
        {
            return View();
        }
        [AuthorizedRoles(new[] { "admin" })]
        public ActionResult Admin() { return View(); }
        //[AuthorizedRoles(new[] { "user" })]
        //public ActionResult Admin() { return View(); }

        public override UnauthorizedResult Unauthorized()
        {
            HttpContext.Response.Redirect("/Home/UnAuthorized");
            return new UnauthorizedResult();
            // return RedirectToAction("Home","UnAuthorized");
            // return base.Unauthorized();
        }
        public ActionResult UnAuthorized()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }

        public IActionResult NMapCommandPage()
        { return View(); }


        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            IExceptionHandlerFeature? context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            Exception? exception = context?.Error;
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier, ex = exception });
        }
        /// <summary>
        /// url : ~/Home/GetTime
        /// </summary>
        /// <returns></returns>
        public String GetTime()
        {
            string sID = GetSessionID();
            return "Session Id :" + sID + "\nTime :" + DateTime.Now.ToString("yyyyy:MM:dd: dddd HH:mm:ss");
            //return RedirectToAction("Home", "Index");
        }
        /// <summary>
        /// url : ~/Home/GetAdminTime
        /// </summary>
        /// <returns></returns>
        [AuthorizedRoles(new[] { "admin" })]
        public String GetAdminTime()
        {
            string sID = GetSessionID();
            return "Session Id :" + sID + "\nAdmin Time :" + DateTime.Now.ToString("yyyyy:MM:dd: dddd HH:mm:ss");
        }
    }
}