using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;


namespace Utils
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Data;
    public static class Utilities
    {
        public static string GetFirstTenant(this String? pathBase)
        {
            if(pathBase == null) return "/";
            var parts = pathBase.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 0) return "/";
            var Tenant = parts[0].Trim();
            return Tenant;
        }
        public static String GetRandomString(this Int32 length)
        {
            const string AllowedChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            char[] chars = new char[length];
            Random rand = new Random();
            for (int i = 0; i < length; i++) chars[i] = AllowedChars[rand.Next(0, AllowedChars.Length)];
            if (Char.IsDigit(chars[0])) chars[0] = AllowedChars[rand.Next(11, 40)];
            return new string(chars);
        }
        public static String DigitRandomNumber(this Int32 length)
        {
            const string AllowedChars = "123456789";
            char[] chars = new char[length];
            Random rand = new Random();
            for (int i = 0; i < length; i++) chars[i] = AllowedChars[rand.Next(0, AllowedChars.Length)];
            return new string(chars);
        }
        public static string ProcessExceptionHTML(this Exception ex)
        {
            StringBuilder strBuild = new StringBuilder(5000);
            Exception? inner = ex;
            String header = "<div class='p-1 border rounded text-center'>############################# Exception begin #############################</div >";
            String tmpl_1 = @"<div class='p-1 row' style='height:40px;'>
                    <div class='col-5 bg-danger' style='height:2px;margin-top:11px;'></div>
                    <div class='col-2'>Recursion Depth = [_LEVEL_]</div>
                    <div class='col-5 bg-danger' style='height:2px;margin-top:11px;'></div>
                </div>";
            Enumerable.Range(0, 10).All(x =>
            {
                if (x == 0)
                {
                    strBuild.Append("<div id='error'>");
                    strBuild.Append(header);
                }
                String tmp = tmpl_1.Replace("_LEVEL_", x.ToString());
                strBuild.Append(tmp);
                strBuild.Append("<hr/><div class='fs-4 fw-bold text-danger'>Message : " + inner.Message + "</div><hr/>");
                strBuild.Append("<div><span class='fs-4 fw-bold text-danger'>Stack Trace : </span>" + inner.StackTrace + "</div><hr/>");
                strBuild.Append(tmp);
                inner = inner.InnerException;
                if (inner == null)
                {
                    strBuild.Append(header);
                    return false;
                }
                return true;
            });
            strBuild.Append("</div>");
            return strBuild.ToString();
        }
        public static string ProcessException(this Exception ex)
        {
            StringBuilder strBuild = new StringBuilder(5000);
            Exception? inner = ex;
            String header = "############################# Exception begin  #############################\n";
            String tmpl_1 = @"Recursion Depth = [_LEVEL_]";
            Enumerable.Range(0, 10).All(x =>
            {
                if (x == 0)
                {
                    strBuild.Append(header);
                }
                String tmp = tmpl_1.Replace("_LEVEL_", x.ToString());
                strBuild.Append(tmp);
                strBuild.Append("\nMessage : " + inner.Message + "\n");
                strBuild.Append("Stack Trace : " + inner.StackTrace + "\n");
                strBuild.Append(tmp);
                inner = inner.InnerException;
                if (inner == null)
                {
                    strBuild.Append(header);
                    return false;
                }
                return true;
            });
            return strBuild.ToString();
        }
        public static bool IsValidMailID(this string emailaddress)
        {
            try { MailAddress m = new MailAddress(emailaddress); return true; }
            catch (FormatException) { return false; }
        }
        public static Object DataTableRowToObject(this DataTable dt, int row_index)
        {
            if (dt.Rows.Count <= 0) return dt;
            var arr = dt.Rows[row_index].ItemArray;
            var kvp = new Dictionary<String, object?>(); int i = 0;
            foreach (var dc in dt.Columns.OfType<DataColumn>()) kvp[dc.ColumnName] = arr[i++];
            return kvp;
        }
        public static void Save(this IFormFile formFile , string physicalPath)
        {
            if (formFile == null) return;
            using (var inputStream = new FileStream(physicalPath, FileMode.Create))
            {
                // read file to stream
                formFile.CopyTo(inputStream);
                // stream to byte array
                byte[] array = new byte[inputStream.Length];
                inputStream.Seek(0, SeekOrigin.Begin);
                inputStream.Read(array, 0, array.Length);
                // get file name
                string fName = formFile.FileName;
            }
        }
    }
}
namespace Utils
{
    //using System.Web.Mvc;
    //using System.Web.Mvc.Filters;
    //using System.Reflection;
    //using System.Net.Mime;
 
    public static class AuthenticationHelpers
    {
        //public static Dictionary<String, String> AjaxMethodNamesThatNeedAuthentication = new Dictionary<string, string>();
        /// <summary>
        /// 
        /// ****************************************************************************************************
        /// This is only for Authentication and NOT autherization of WEB API/Ajax Methods. For autherization i.e, 
        /// roles refer UserRoleProvider.cs.
        /// ****************************************************************************************************
        /// What is an Ajax method : A public action/method that does not return ActionResult.
        /// ****************************************************************************************************
        /// How to use this method: In your home controller class do like this {Shown below }
        /// 
        ///public partial class HomeController : Controller
        ///{
        ///    protected override void OnAuthentication(AuthenticationContext authContext)
        ///    {
        ///        if (!this.DoesAjaxMethodNeedsAuthentication(authContext)) base.OnAuthentication(authContext);
        ///    }
        ///}
        ///}
        /// For methods like the one shown below , with the AllowAnonymous method it works as passwhtough
        /// [AllowAnonymousss]
        ///public string GetServerTime()
        ///{
        ///    return DateTime.Now.ToString();
        ///}
        ///
        /// For Ajax methods that needs authentication, the below extension method prevents returning the login page 
        /// </summary>
        /// <param name="ControlBuild"></param>
        /// <param name="authContext"></param>
        /// <returns></returns>
        //public static bool DoesAjaxMethodNeedsAuthentication(this Controller ControlBuild, AuthenticationContext authContext)
        //{
        //    if (authContext.RequestContext.HttpContext.Request.IsAuthenticated) return false;
        //    var rd = authContext.HttpContext.Request.RequestContext.RouteData;
        //    string currentActionName = rd.GetRequiredString("action");
        //    string currentControllerName = rd.GetRequiredString("controller");

        //    String CachedActionName = null;
        //    if (AuthenticationHelpers.AjaxMethodNamesThatNeedAuthentication.TryGetValue(currentActionName, out CachedActionName))
        //    {
        //        //authContext.HttpContext.Response.StatusCode = 403;
        //        authContext.Result = new ContentResult { Content = "unauthenticated", ContentType = MediaTypeNames.Text.Plain };
        //        return true;
        //    }
        //    MethodInfo mi = ControlBuild.GetType().GetMethod(currentActionName, System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
        //    if (mi.ReturnType != typeof(ActionResult))
        //    {
        //        var attr = mi.GetCustomAttribute(typeof(AllowAnonymousAttribute));
        //        if (null == attr)
        //        {
        //            //authContext.HttpContext.Response.StatusCode = 403;
        //            //authContext.Result = new ContentResult { Content = "unauthenticated", ContentType = MediaTypeNames.Text.Plain };
        //            //AuthenticationHelpers.AjaxMethodNamesThatNeedAuthentication[currentActionName] = currentActionName;
        //            authContext.Result = new HttpUnauthorizedResult("unauthorized");
        //            authContext.HttpContext.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
        //            return true;
        //        }
        //    }
        //    return false;
        //}
    }
}