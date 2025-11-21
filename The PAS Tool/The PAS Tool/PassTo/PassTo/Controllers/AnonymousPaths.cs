using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Utils;

namespace MinimalOverflow.Controllers
{
    public partial class HomeController : Controller
    {
        [AllowAnonymous]
        public IActionResult ChangePassword()
        {
            if (User.Identity.IsAuthenticated) ViewBag.TempUserEmail = SessionValues.TempUserEmail = User.Identity.Name;
            else
            {
                ViewBag.Name = SessionValues.Name;
                ViewBag.TempUserEmail = SessionValues.TempUserEmail;
                ViewBag.TempPWD = SessionValues.TempPWD;
                ViewBag.Role = SessionValues.UserRole;
                ViewBag.id = SessionValues.UserId;
            }
            return View();
        }
        [AllowAnonymous]
        public IActionResult About()
        {
            return View();
        }
        [AllowAnonymous]
        public String GetServerTime()
        {
            if (!User.Identity.IsAuthenticated) return "Unthenticated damar";
            //string sID = GetSessionID();
            var allCookies = Response.Cookies;
            //Response.Cookies.Delete(BasicAction.AuthModel?.Name ?? "Amazing", new CookieOptions { Secure=true});
            //Response.Cookies.Delete(".ASPXAUTH", new CookieOptions { Secure = true });
            //Response.Cookies.Delete(".AspNetCore.Session", new CookieOptions { Secure=true});
            var cookie = Request.Cookies["Amazing"];//.Expires.ToString();


            //Response.Cookies.Append("Amazing", "", new CookieOptions()
            //{
            //    Expires = DateTime.Now.AddDays(-1),
            //    Secure = true,
            //});
            //Response.Cookies.Append(".AspNetCore.Session", "", new CookieOptions()
            //{
            //    Expires = DateTime.Now.AddDays(-1),
            //    Secure = true,
            //});

            //HttpContext.Response.Cookies.Delete(BasicAction.AuthModel?.Name ?? "Amazing");
            //return "Session Id :" + sID + "\nTime :" + DateTime.Now.ToString("yyyyy:MM:dd: dddd HH:mm:ss");
            var the_now = DateTime.Now;
            var the_later = the_now.Add(BasicAction.ExpireTimeSpan);
            return the_now.ToString("yyyyy:MM:dd - dddd HH:mm:ss") + "," + the_later.ToString("yyyyy:MM:dd - dddd HH:mm:ss");
            //return RedirectToAction("Home", "Index");
        }
    }
}
