using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<APIResult<Unit>>
        {
            public Activity activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator(){
                RuleFor(x=>x.activity).SetValidator(new ActivityValidator());
            }
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
                context.Activities.Add(request.activity);

                var result = await context.SaveChangesAsync() > 0;

                if (!result)  
                    return APIResult<Unit>.Fail("Failed to create Activity");
                    
                return APIResult<Unit>.Sucess(Unit.Value);
            }
        }
    }
}