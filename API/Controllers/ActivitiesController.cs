using Application.Activities;
using Domain;
using MediatR;
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
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //activities/id
        public async Task<ActionResult<Activity>> getActivityById(Guid id)
        {
            return await Mediator.Send(new Details.Query
            {
                Id = id
            });
        }

        [HttpPost]
        public async Task<IActionResult> createActivity(Activity activity)
        {
            return Ok(await Mediator.Send(
                new Create.Command
                {
                    activity = activity
                }
            ));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> editActivity(Guid id,Activity activity)
        {
            activity.Id = id;

            return Ok(await Mediator.Send(
                new Edit.Command{
                    activity = activity
                }
            ));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteActivity(Guid id){
            return Ok(await Mediator.Send(new Delete.Command{
                id = id
            }));
        }
    }
}
