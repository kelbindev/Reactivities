using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<APIResult<PagedList<ActivityDTO>>>
        {
            public ActivityParams Params { get; set; }
        }
        public class Handler : IRequestHandler<Query, APIResult<PagedList<ActivityDTO>>>
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

            public async Task<APIResult<PagedList<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query =
                 _context.Activities.OrderByDescending(d => d.Date)
                 .Where(d => d.Date >= request.Params.StartDate)
                .ProjectTo<ActivityDTO>(mapper.ConfigurationProvider, new { currentUsername = userAccesor.GetUsername() })
                .AsQueryable();

                if (request.Params.isGoing
                //  && !request.Params.isHost
                 )
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == userAccesor.GetUsername()));
                }

                if (request.Params.isHost
                // && !request.Params.isGoing
                )
                {
                    query = query.Where(x => x.HostUsername == userAccesor.GetUsername());
                }

                return APIResult<PagedList<ActivityDTO>>.Sucess(
                    await PagedList<ActivityDTO>.CreateAsync(query,
                    request.Params.PageNumber,
                    request.Params.PageSize)
                );
            }
        }
    }
}