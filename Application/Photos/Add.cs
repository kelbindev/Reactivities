using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<APIResult<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, APIResult<Photo>>
        {
            private readonly DataContext context;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IUserAccesor userAccesor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccesor user)
            {
                this.userAccesor = user;
                this.photoAccessor = photoAccessor;
                this.context = context;
            }

            public async Task<APIResult<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x=>x.UserName == userAccesor.GetUsername());

                if (user == null) return null;

                var PhotosUploadResult = await photoAccessor.AddPhoto(request.File);

                var photo = new Photo{
                    Url = PhotosUploadResult.Url,
                    Id = PhotosUploadResult.PublicId
                };

                if (!user.Photos.Any(x=>x.isMain)){
                    photo.isMain = true;
                }

                user.Photos.Add(photo);

                var result = await context.SaveChangesAsync() > 0;

                if (result){
                    return APIResult<Photo>.Sucess(photo); 
                }
               
                 return APIResult<Photo>.Fail("Problem Adding Photo"); 

            }
        }

    }
}