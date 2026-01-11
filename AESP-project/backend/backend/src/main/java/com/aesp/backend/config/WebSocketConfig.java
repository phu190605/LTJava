package com.aesp.backend.config;

import com.aesp.backend.peer.handler.PeerWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker // Hỗ trợ cả cách của bạn học
public class WebSocketConfig implements WebSocketConfigurer, WebSocketMessageBrokerConfigurer {

    private final PeerWebSocketHandler handler;

    public WebSocketConfig(PeerWebSocketHandler handler) {
        this.handler = handler;
    }

    // --- (Dùng cho Peer-to-Peer & WebRTC) ---
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/peer").setAllowedOrigins("*");
    }

    // ---  (Dùng cho Chat Group/Topic) ---
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}