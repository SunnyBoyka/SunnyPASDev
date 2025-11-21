using Microsoft.AspNetCore.StaticFiles;
using MinimalOverflow;
using Serilog;
{
    WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    //builder.Services.AddExceptionHandler<CustomExceptionHandler>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
    });
    builder.Services.AddMvc().AddSessionStateTempDataProvider();
    builder.Services.AddSession();
    Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration).CreateLogger();
    builder.Host.UseSerilog();
    builder.Services.AddControllers();
    builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation(); 
    builder.Services.AddCookieAuthentication();
    builder.Services.AddSingleton<IPathProvider, PathProvider>();

    builder.Services.AddHttpContextAccessor(); //----> (1a) search for (1b) in Utils/BasicAction.cs, this will let us acces the HttpContext outsode the controller also
    //builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>(); the above and this are same. Both are same - Bala Krishna

    WebApplication app = builder.Build();


    // Configure MIME type for .pem files
    var provider = new FileExtensionContentTypeProvider();
    provider.Mappings[".pem"] = "application/x-pem-file";

    app.UseStaticFiles(new StaticFileOptions
    {
        ContentTypeProvider = provider
    });
    app.UseHttpsRedirection();
    // pem

    app.AddMiddleWare();

    app.UseExceptionHandler("/Home/Error");

    app.AddTenants();

    app.UseStaticFiles();

    app.UseSession();

    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
    app.Run();
}