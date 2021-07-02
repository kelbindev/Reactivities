using System.Linq;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDTO>()
            .ForMember(x => x.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(v => v.isHost == true).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(x => x.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(x => x.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(x => x.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(x => x.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.isMain).Url))
                .ForMember(x => x.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(x => x.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(x => x.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(x => x.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.isMain).Url))
                .ForMember(x => x.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(x => x.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(x => x.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<Comment, CommentDto>()
                .ForMember(x => x.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(x => x.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(x => x.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.isMain).Url));
            CreateMap<Activity, Profiles.UserActivityDto>()
                .ForMember(x => x.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(v => v.isHost == true).AppUser.UserName));

        }
    }
}