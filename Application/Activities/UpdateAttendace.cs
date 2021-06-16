using MediatR;
using Application.Core;
using System;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Domain;

namespace Application.Activities
{
    public class UpdateAttendace
    {
        public class Command : IRequest<APIResult<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, APIResult<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccesor userAccesor;
            public Handler(DataContext context, IUserAccesor userAccesor)
            {
                this.userAccesor = userAccesor;
                this.context = context;
            }

            public async Task<APIResult<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities
                    .Include(x => x.Attendees).ThenInclude(i => i.AppUser)
                    .SingleOrDefaultAsync(aa => aa.Id == request.Id);

                if (activity == null) return null;

                var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == userAccesor.GetUsername());

                if (user == null) return null;

                var HostUsername = activity.Attendees.FirstOrDefault(x => x.isHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (attendance != null && HostUsername == user.UserName)
                {
                    activity.isCancelled = !activity.isCancelled;
                }

                if (attendance != null && HostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        isHost = false
                    };

                    activity.Attendees.Add(attendance);

                }

                var result = await context.SaveChangesAsync() > 0;

                return result? APIResult<Unit>.Sucess(Unit.Value) : APIResult<Unit>.Fail("Problem Updating Attendance");
            }
        }
    }
}