using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
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
            private readonly IMapper autoMapper;
            public Handler(DataContext context, IMapper autoMapper)
            {
                this.autoMapper = autoMapper;
                this.context = context;
            }

            public async Task<APIResult<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var _activity = context.Activities.Find(request.activity.Id);

                if (_activity == null)
                                    return null;


                autoMapper.Map(request.activity,_activity);

                var result = await context.SaveChangesAsync() > 0;

                 if (!result)
                    return APIResult<Unit>.Fail("Update Activity Failed");

                return APIResult<Unit>.Sucess(Unit.Value);
            }
        }
    }
}