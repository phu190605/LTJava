package com.aesp.backend.service;

import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.aesp.backend.dto.match.MatchRequest;
import com.aesp.backend.dto.match.MatchResponse;
import com.aesp.backend.model.Room;

@Service
public class MatchingService {

    private final Map<String, Queue<String>> waitingQueues = new ConcurrentHashMap<>();
    private final Map<String, Room> rooms = new ConcurrentHashMap<>();

    @Autowired
    SimpMessagingTemplate messagingTemplate; // package-private for test visibility

    private String queueKey(MatchRequest req) {
        return req.getTopic() + "::" + req.getLevel();
    }

    public void requestMatch(MatchRequest req) {
        String key = queueKey(req);
        waitingQueues.putIfAbsent(key, new ConcurrentLinkedQueue<>());
        Queue<String> q = waitingQueues.get(key);

        // Try to pair with waiting user
        String waitingClient = q.poll();
        if (waitingClient == null) {
            // no one waiting -> add to queue
            q.add(req.getClientId());
            // Optionally notify client that they are queued
            messagingTemplate.convertAndSend("/topic/match/" + req.getClientId(), "queued");
            return;
        }

        // create room
        String roomId = UUID.randomUUID().toString();
        Room room = new Room(roomId, req.getTopic(), req.getLevel());
        room.getParticipants().add(waitingClient);
        room.getParticipants().add(req.getClientId());
        room.setState(Room.State.ACTIVE);
        rooms.put(roomId, room);

        // notify both clients with match response
        MatchResponse r1 = new MatchResponse(roomId, req.getClientId(), req.getTopic(), req.getLevel());
        MatchResponse r2 = new MatchResponse(roomId, waitingClient, req.getTopic(), req.getLevel());

        messagingTemplate.convertAndSend("/topic/match/" + waitingClient, r1);
        messagingTemplate.convertAndSend("/topic/match/" + req.getClientId(), r2);
    }

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

    public void broadcastToRoom(String roomId, Object payload) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId, payload);
    }

    public void endRoom(String roomId) {
        Room r = rooms.get(roomId);
        if (r != null) {
            r.setState(Room.State.FINISHED);
            rooms.remove(roomId);
        }
    }
}
