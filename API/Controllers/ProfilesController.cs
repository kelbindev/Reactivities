using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpPost("updateAbout")]
        public async Task<IActionResult> upadteAbout(Profile profile)
        {
            return HandleResult(await Mediator.Send(new UpdateAbout.Command { profile = profile }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> userActivities(string username, string predicate){
            return HandleResult(await Mediator.Send(new Application.Activities.ListProfileActivities.Query{username = username, predicate = predicate}));
        }
    }
}
