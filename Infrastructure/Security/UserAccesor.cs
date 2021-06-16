using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccesor : IUserAccesor
    {
        public IHttpContextAccessor HttpContextAccessor { get; set; }
        public UserAccesor(IHttpContextAccessor httpContextAccessor)
        {
            this.HttpContextAccessor = httpContextAccessor;
        }

        public string GetUsername()
        {
           return HttpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}