using System;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator mediator;

        public ChatHub(IMediator mediator)
        {
            this.mediator = mediator;
        }

        public async Task SendComment(Create.Command command){
            var comment = await mediator.Send(command);

        await Clients.Group(command.ActivityId.ToString())
        .SendAsync("ReceiveComment",comment.Value);
        }

        public override async Task OnConnectedAsync(){
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId,activityId);
            var result = await mediator.Send(new List.Query{activityId = Guid.Parse(activityId)});
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }

    }
}