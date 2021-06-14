using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> getActivities()
        {
            var result = await Mediator.Send(new List.Query());
            return HandleResult(result);
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command
            {
                id = id
            }));
        }
    }
}
