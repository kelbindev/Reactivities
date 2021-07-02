using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using Application.Core;
using API.Extension;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ?? HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(APIResult<T> result)
        {
            if (result == null)
                return NotFound();
            if (result.isSucess && result.Value != null)
                return Ok(result.Value);
            if (result.isSucess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }

        protected ActionResult HandlePagedResult<T>(APIResult<PagedList<T>> result)
        {
            if (result == null)
                return NotFound();
            if (result.isSucess && result.Value != null)
            {
                Response.addPaginationHeader(result.Value.CurrentPage,
                result.Value.PageSize,result.Value.TotalCount,result.Value.TotalPage);
                return Ok(result.Value);
            };
            if (result.isSucess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }
    }
}
