using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using Application.Core;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator  => _mediator ?? HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(APIResult<T> result){
            if (result == null)
                return NotFound();
            if (result.isSucess && result.Value != null)
                return Ok(result.Value);
            if (result.isSucess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }
    }
}
