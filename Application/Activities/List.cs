using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<APIResult<List<ActivityDTO>>> { }
        public class Handler : IRequestHandler<Query, APIResult<List<ActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;
            private readonly IUserAccesor userAccesor;

            public Handler(DataContext context, IMapper mapper, IUserAccesor userAccesor)
            {
                this.mapper = mapper;
                this.userAccesor = userAccesor;
                _context = context;
            }

            public async Task<APIResult<List<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities =
                await _context.Activities
                .ProjectTo<ActivityDTO>(mapper.ConfigurationProvider, new {currentUsername = userAccesor.GetUsername()})
                .ToListAsync(cancellationToken);

                return APIResult<List<ActivityDTO>>.Sucess(activities);
            }
        }
    }
}