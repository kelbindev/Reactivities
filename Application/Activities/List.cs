using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<APIResult<List<Activity>>> { }
        public class Handler : IRequestHandler<Query, APIResult<List<Activity>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<APIResult<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var result =  await _context.Activities.ToListAsync();

                return APIResult<List<Activity>>.Sucess(result);
            }
        }
    }
}