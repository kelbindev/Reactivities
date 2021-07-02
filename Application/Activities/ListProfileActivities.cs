using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ListProfileActivities
    {
        public class Query : IRequest<APIResult<List<UserActivityDto>>>
        {
            public string username;
            public string predicate;
        }

        public class Handler : IRequestHandler<Query, APIResult<List<UserActivityDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<APIResult<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                string predicate = request.predicate;
                string username = request.username;

                var result = new List<UserActivityDto>();

                switch (predicate)
                {
                    case "future":
                        result = await context.Activities
                        .Include(x => x.Attendees)
                        .Where(x => x.Date >= DateTime.Now && x.Attendees.Any(x => x.AppUser.UserName == request.username))
                        .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                        .ToListAsync();
                        break;
                    case "past":
                        result = await context.Activities
                       .Include(x => x.Attendees)
                       .Where(x => x.Date <= DateTime.Now && x.Attendees.Any(x => x.AppUser.UserName == request.username))
                       .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                       .ToListAsync();
                        break;
                    case "isHost":
                        result = await context.Activities
                       .Include(x => x.Attendees)
                       .Where(x => x.Attendees.FirstOrDefault(at => at.isHost == true).AppUser.UserName == username)
                       .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                       .ToListAsync();
                        break;
                    default:
                        result = await context.Activities
                      .Include(x => x.Attendees)
                      .Where(x => x.Attendees.Any(x => x.AppUser.UserName == request.username))
                      .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                      .ToListAsync();
                        break;
                }

                if (result == null) return APIResult<List<UserActivityDto>>.Fail("Error Getting Activities Data");

                return APIResult<List<UserActivityDto>>.Sucess(result);

            }
        }
    }
}