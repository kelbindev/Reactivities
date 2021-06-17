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
    public class SetMain
    {
        public class Command : IRequest<APIResult<Unit>>
        {
            public string id { get; set; }
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

                var photo = user.Photos.First(x => x.Id == request.id);

                if (photo == null) return null;

                var currentMain = user.Photos.FirstOrDefault(x => x.isMain);

                if (currentMain != null)
                {
                    currentMain.isMain = false;
                }

                photo.isMain = true;

                var sucess = await context.SaveChangesAsync() > 0;

                return
                    sucess ? APIResult<Unit>.Sucess(Unit.Value)
                    : APIResult<Unit>.Fail("Fail To Update Main Photo");
            }
        }
    }
}
