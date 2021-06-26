using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<APIResult<Unit>>{
            public string TargetUserName {get;set;}
        }

        public class Handler : IRequestHandler<Command, APIResult<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccesor userAccesor;

            public Handler(DataContext context, IUserAccesor userAccesor)
            {
                this.context = context;
                this.userAccesor = userAccesor;
            }

            public async Task<APIResult<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await context.Users.FirstOrDefaultAsync(x=>x.UserName == userAccesor.GetUsername());

                var target = await context.Users.FirstOrDefaultAsync(x=>x.UserName == request.TargetUserName);

                if (target == null) return null;

                var following = await context.UserFollowings.FindAsync(observer.Id,target.Id);

                if (following == null) {
                    following = new UserFollowing{
                        Observer = observer,
                        Target = target
                    };

                    context.UserFollowings.Add(following);
                }
                else
                {
                    context.UserFollowings.Remove(following);
                }

                var sucess = await context.SaveChangesAsync() > 0;

                if (sucess) return APIResult<Unit>.Sucess(Unit.Value);

                return APIResult<Unit>.Fail("Failed to update following");

            }
        }
    }
}