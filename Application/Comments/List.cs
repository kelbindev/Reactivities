using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<APIResult<List<CommentDto>>>{
            public Guid activityId {get;set;}    
        }

        public class Handler : IRequestHandler<Query, APIResult<List<CommentDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<APIResult<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = 
                await context.Comments
                .Where(x=>x.activity.Id == request.activityId)
                .OrderByDescending(x=>x.CreatedAt)
                .ProjectTo<CommentDto>(mapper.ConfigurationProvider)
                .ToListAsync();
                
                return APIResult<List<CommentDto>>.Sucess(comments);
            }
        }


    }
}