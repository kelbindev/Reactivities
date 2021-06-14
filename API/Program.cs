using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using var scope = host.Services.CreateScope();

            var Services = scope.ServiceProvider;

            try
            {
                var Context = Services.GetRequiredService<DataContext>();
                var userManager = Services.GetRequiredService<UserManager<AppUser>>();
                await Context.Database.MigrateAsync();
                await Seed.SeedData(Context, userManager);
            }
            catch (Exception ex)
            {
                var logger = Services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex,"an error has occured");
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
