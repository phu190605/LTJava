package com.aesp.backend.peer.config; 
import com.aesp.backend.peer.handler.PeerWebSocketHandler; 
import org.springframework.context.annotation.Configuration; 
import org.springframework.web.socket.config.annotation.*; 

@Configuration 
@EnableWebSocket public class WebSocketConfig implements WebSocketConfigurer { private final PeerWebSocketHandler handler; public WebSocketConfig(PeerWebSocketHandler handler) { this.handler = handler; } @Override public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) { registry.addHandler(handler, "/peer") .setAllowedOrigins("*"); } }
public class WebSocketConfig implements WebSocketConfigurer { 
    private final PeerWebSocketHandler handler; 
    public WebSocketConfig(PeerWebSocketHandler handler) { 
        this.handler = handler; 
    } 
    @Override 
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) { 
        registry.addHandler(handler, "/peer") 
                .setAllowedOrigins("*"); 
    } 
}