using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<APIResult<Unit>>
        {
            public Activity activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.activity).SetValidator(new ActivityValidator());
            }
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
                var _user = await context.Users.FirstOrDefaultAsync(x=> x.UserName == userAccesor.GetUsername());

                var attendee = new ActivityAttendee {
                    AppUser = _user,
                    Activity = request.activity,
                    isHost = true
                };

                request.activity.Attendees.Add(attendee);

                context.Activities.Add(request.activity);

                var result = await context.SaveChangesAsync() > 0;

                if (!result)
                    return APIResult<Unit>.Fail("Failed to create Activity");

                return APIResult<Unit>.Sucess(Unit.Value);
            }
        }
    }
}