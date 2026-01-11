package com.aesp.backend.peer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.socket.WebSocketSession;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeerUserSession {
    private String userId;
    private String level;
    private String topic;
    private WebSocketSession session;
}
