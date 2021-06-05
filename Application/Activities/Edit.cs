using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;
            private readonly IMapper autoMapper;
            public Handler(DataContext context, IMapper autoMapper)
            {
                this.autoMapper = autoMapper;
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var _activity = context.Activities.Find(request.activity.Id);

                autoMapper.Map(request.activity,_activity);

                _activity.Title = request.activity.Title;
                _activity.Category = request.activity.Category;
                _activity.City = request.activity.City;
                _activity.Date = request.activity.Date;
                _activity.Description = request.activity.Description;
                _activity.Venue = request.activity.Venue;

                await context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}