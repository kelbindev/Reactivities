using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
          public class Command : IRequest
        {
            public Guid id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;
            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Console.WriteLine(request.id);
                var _activity = await context.Activities.FindAsync(request.id);

                context.Remove(_activity); 

                await context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}