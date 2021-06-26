using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<APIResult<Profile>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, APIResult<Profile>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccesor userAccesor;

            public Handler(DataContext context, IMapper mapper, IUserAccesor userAccesor)
            {
                this.userAccesor = userAccesor;
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<APIResult<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users
                    .ProjectTo<Profile>(mapper.ConfigurationProvider, new { currentUsername = userAccesor.GetUsername()})
                    .SingleOrDefaultAsync(x => x.Username == request.Username);

                return APIResult<Profile>.Sucess(user);
            }
        }
    }
}
