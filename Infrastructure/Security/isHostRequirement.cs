using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class isHostRequirement : IAuthorizationRequirement
    {

    }

    public class isHostRequirementHandler : AuthorizationHandler<isHostRequirement>
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly DataContext dbContext;
        public isHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, isHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            var activityId = Guid.Parse(httpContextAccessor.HttpContext.Request.RouteValues
            .SingleOrDefault(x=>x.Key == "id").Value.ToString());

            var attendee = dbContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(
                x=> x.AppUserId == userId && x.ActivityId == activityId
            ).Result;

            if (attendee == null) return Task.CompletedTask;

            if (attendee.isHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}