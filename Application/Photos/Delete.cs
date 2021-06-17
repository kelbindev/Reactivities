using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<APIResult<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, APIResult<Unit>>
        {
            private readonly DataContext context;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IUserAccesor userAccesor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccesor user)
            {
                this.context = context;
                this.photoAccessor = photoAccessor;
                this.userAccesor = user;
            }

            public async Task<APIResult<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == userAccesor.GetUsername());

                if (user == null) return null;

                var photo = user.Photos.First(x => x.Id == request.Id);

                if (photo == null) return null;

                if (photo.isMain) return APIResult<Unit>.Fail("You cannot delete your main photo");

                var result = await photoAccessor.DeletePhoto(photo.Id);

                if (result == null) return APIResult<Unit>.Fail("Problem deleting photo");

                user.Photos.Remove(photo);

                var success = await context.SaveChangesAsync() > 0;

                if (success) return APIResult<Unit>.Sucess(Unit.Value);

                return APIResult<Unit>.Fail("Problem Deleting photo from API");
            }
        }
    }
}
