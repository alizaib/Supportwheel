﻿using Microsoft.AspNet.SignalR;

namespace SupportWheel.Api.Hubs
{
    public class ApiHub : Hub
    {
        public void Subscribe(string resource)
        {
            Groups.Add(Context.ConnectionId, resource);
        }

        public void Unsubscribe(string resource)
        {
            Groups.Remove(Context.ConnectionId, resource);
        }
    }
}
