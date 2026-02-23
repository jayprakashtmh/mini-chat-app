package com.chatapp.config;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        String username = event.getUser().getName();
        onlineUsers.add(username);
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String username = event.getUser().getName();
        onlineUsers.remove(username);
    }

    public static Set<String> getOnlineUsers() {
        return onlineUsers;
    }
}

