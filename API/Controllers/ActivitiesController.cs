using Application;
using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> getActivities([FromQuery] ActivityParams pagingParams)
        {
            var result = await Mediator.Send(new List.Query{Params = pagingParams});
            return HandlePagedResult(result);
        }
        [HttpGet("{id}")] //activities/id
        public async Task<ActionResult<Activity>> getActivityById(Guid id)
        {
            var result = await Mediator.Send(new Details.Query
            {
                Id = id
            });

            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> createActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(
                new Create.Command
                {
                    activity = activity
                }
            ));
        }
        [Authorize(Policy = "isActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> editActivity(Guid id, Activity activity)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(
                new Edit.Command
                {
                    activity = activity
                }
            ));
        }
        [Authorize(Policy = "isActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command
            {
                id = id
            }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendace.Command{Id=id}));
        }

    }
}
