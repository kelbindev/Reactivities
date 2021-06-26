using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<APIResult<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string userName { get; set; }
        }

        public class Handler : IRequestHandler<Query, APIResult<List<Profiles.Profile>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccesor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccesor userAccessor)
            {
                this.context = context;
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<APIResult<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                         profiles = await context.UserFollowings.Where(x => x.Target.UserName == request.userName)
                        .Select(u => u.Observer)
                        .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider, new {currentUsername = userAccessor.GetUsername()})
                        .ToListAsync();
                        break;
                    case "following":
                        profiles = await context.UserFollowings.Where(x => x.Observer.UserName == request.userName)
                        .Select(u => u.Target)
                        .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider, new {currentUsername = userAccessor.GetUsername()})
                        .ToListAsync();
                        break;
                }

                return APIResult<List<Profiles.Profile>>.Sucess(profiles);

            }
        }
    }
}