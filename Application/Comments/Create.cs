using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<APIResult<CommentDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator(){
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, APIResult<CommentDto>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccesor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccesor userAccessor)
            {
                this.context = context;
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<APIResult<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync(request.ActivityId);

                if (activity == null) return null;

                var user = await context.Users.Include(p=>p.Photos).FirstAsync(x=>x.UserName == userAccessor.GetUsername());

                var comment = new Comment{
                    Body = request.Body,
                    activity = activity,
                    Author = user
                };

                activity.Comments.Add(comment);

                var success = await context.SaveChangesAsync() > 0;

                if (success) return APIResult<CommentDto>.Sucess(mapper.Map<CommentDto>(comment));

                return APIResult<CommentDto>.Fail("Problem Creating Comment");
            }
        }

    }


}