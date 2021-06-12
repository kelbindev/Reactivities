using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
          public class Command : IRequest<APIResult<Unit>>
        {
            public Guid id { get; set; }
        }

        public class Handler : IRequestHandler<Command, APIResult<Unit>>
        {
            private readonly DataContext context;
            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<APIResult<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Console.WriteLine(request.id);
                var _activity = await context.Activities.FindAsync(request.id);
                
                if (_activity == null)
                    return null;

                context.Remove(_activity); 

                var result = await context.SaveChangesAsync() > 0;
                
                if (!result)
                    return APIResult<Unit>.Fail("Delete Activity Failed");

                return APIResult<Unit>.Sucess(Unit.Value);
            }
        }
    }
}