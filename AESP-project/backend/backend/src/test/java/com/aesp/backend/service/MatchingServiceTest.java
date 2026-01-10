package com.aesp.backend.service;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.aesp.backend.dto.match.MatchRequest;

class MatchingServiceTest {

    @Test
    void matchTwoClients_createsRoomAndNotifiesBoth() {
        SimpMessagingTemplate template = Mockito.mock(SimpMessagingTemplate.class);
        MatchingService svc = new MatchingService();
        // inject mock
        svc.messagingTemplate = template;

        MatchRequest r1 = new MatchRequest();
        r1.setClientId("c1");
        r1.setTopic("Travel");
        r1.setLevel("Beginner");

        MatchRequest r2 = new MatchRequest();
        r2.setClientId("c2");
        r2.setTopic("Travel");
        r2.setLevel("Beginner");

        svc.requestMatch(r1);
        svc.requestMatch(r2);

        // after both requests, there should be a room published to both clients
        Mockito.verify(template, Mockito.atLeastOnce()).convertAndSend(Mockito.eq("/topic/match/c1"), Mockito.any(Object.class));
        Mockito.verify(template, Mockito.atLeastOnce()).convertAndSend(Mockito.eq("/topic/match/c2"), Mockito.any(Object.class));

        // ensure a room can be retrieved; get the roomId from the sent message argument
        // This is a light test; deeper assertions would require capturing the payload
    }
}
