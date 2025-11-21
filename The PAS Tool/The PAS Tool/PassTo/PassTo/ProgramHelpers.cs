using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Options;
using Utils;
using Microsoft.AspNetCore.Authentication;

namespace MinimalOverflow
{
    public interface IPathProvider { string MapPath(string path); }
    public class PathProvider : IPathProvider
    {
        private IWebHostEnvironment _hostEnvironment;

        public PathProvider(IWebHostEnvironment environment) { _hostEnvironment = environment; }

        public string MapPath(string path)
        {
            Uri u = new Uri(_hostEnvironment.WebRootPath + path);
            return u.LocalPath;
        }
    }

    public class AuthorizedRoles : TypeFilterAttribute
    {
        public AuthorizedRoles(params string[] authorizedRoles) : base(typeof(AuthorizationFilter)) { Arguments = new object[] { authorizedRoles }; }
        private class AuthorizationFilter : IActionFilter
        {
            private readonly ILogger _logger;
            private readonly string[] _authorizedRoles;
            public AuthorizationFilter(ILoggerFactory loggerFactory, string[] authorizedRoles)
            {
                _logger = loggerFactory.CreateLogger<AuthorizedRoles>();
                _authorizedRoles = authorizedRoles;
            }
            public void OnActionExecuting(ActionExecutingContext context)
            {
                //context.HttpContext.User.IsInRole("admin"); _authorizedRoles.Contains("admin");
                List<Claim> roleClaims = context.HttpContext.User.FindAll(ClaimTypes.Role).ToList();
                List<String> roles = new List<string>();
                foreach (var role in roleClaims) roles.Add(role.Value);
                if (roles.Intersect(_authorizedRoles).Count() == 0) context.Result = new ViewResult { ViewName = "UnAuthorized" };
            }
            public void OnActionExecuted(ActionExecutedContext context) { }
        }
    }

    public static class CookieeAuthenticationExtensions
    {
        public static void AddCookieAuthentication(this IServiceCollection Services) { Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, CookieeAuthenticationExtensions.configureOptions); }
        public static Action<CookieAuthenticationOptions> configureOptions = (CookieAuthenticationOptions options) =>
        {
            options.Cookie.Name = BasicAction.AuthModel?.Name ?? "Amazing";
            options.LoginPath = "/Home/Login";
            //options.ExpireTimeSpan = new TimeSpan(0, 0, 10);
            options.ExpireTimeSpan = BasicAction.ExpireTimeSpan;
            options.Cookie.MaxAge = BasicAction.ExpireTimeSpan; 
            //options.ExpireTimeSpan = new TimeSpan(BasicAction.AuthModel?.Expiry?[0] ?? 0, BasicAction.AuthModel?.Expiry?[1] ?? 20, BasicAction.AuthModel?.Expiry?[2] ?? 10);
            options.SlidingExpiration = true;
            options.Cookie.SecurePolicy = CookieSecurePolicy.None;
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.Redirect(context.Request.PathBase + "/Home/Login");
                return Task.CompletedTask;
            };
        };
    }

    public static class JustAMiddleware
    {
        public static void AddMiddleWare(this WebApplication app) { app.Use(JustAMiddleware.Add); }
        public static Func<HttpContext, RequestDelegate, Task> Add = async (HttpContext context, RequestDelegate _next) =>
        {
            string pt = Utilities.GetFirstTenant(context.Request.Path);
            if (pt == "/")
            {
                context.Response.Redirect("/PasTool");
                return;
            }
            await _next(context);
            //context.Response.AppendTrailer("Trailer", "Trailer value");
            //await context.Response.WriteAsync("you cannot come here");
        };
    }

    public static class TenantHelpers
    {
        //// Multitenency , build one url for each tenant ////
        public static void AddTenants(this WebApplication app)
        {
            try{
                BasicAction.AllTenants?.ForEach(tenant =>
                {
                    app.UsePathBase(new Microsoft.AspNetCore.Http.PathString("/" + tenant.Name));
                });
            }catch(Exception ex)
            {
                string str = ex.ProcessException();
            }
        }
    }
}
