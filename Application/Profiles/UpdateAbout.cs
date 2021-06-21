using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class UpdateAbout
    {
        public class Command : IRequest<APIResult<Unit>>
        {
            public Profile profile { get; set; }
        }

        public class Handler : IRequestHandler<Command, APIResult<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccesor userAccessor;
            public Handler(DataContext context, IUserAccesor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;
            }

            public async Task<APIResult<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.FirstOrDefaultAsync(x=>x.UserName == userAccessor.GetUsername());

                user.DisplayName = request.profile.DisplayName;
                user.Bio = request.profile.Bio;

                var result = await context.SaveChangesAsync() > 0;

                if (result){
                    return APIResult<Unit>.Sucess(Unit.Value);
                }

                return APIResult<Unit>.Fail("Problem Updating Profile");
            }
        }
    }
}