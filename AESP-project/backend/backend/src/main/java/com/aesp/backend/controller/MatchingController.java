package com.aesp.backend.controller;

import com.aesp.backend.dto.match.MatchRequest;
import com.aesp.backend.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @MessageMapping("/match")
    public void match(@Payload MatchRequest request) {
        // client sends MatchRequest to /app/match
        matchingService.requestMatch(request);
    }

    @MessageMapping("/room/{roomId}/message")
    public void roomMessage(@DestinationVariable String roomId, @Payload Object payload) {
        // broadcast to room subscribers
        matchingService.broadcastToRoom(roomId, payload);
    }
}
