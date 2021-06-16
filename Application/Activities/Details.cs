using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<APIResult<ActivityDTO>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, APIResult<ActivityDTO>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
            }

            public async Task<APIResult<ActivityDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities
                .ProjectTo<ActivityDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x=>x.Id == request.Id);

                return APIResult<ActivityDTO>.Sucess(activity);
            }
        }
    }
}