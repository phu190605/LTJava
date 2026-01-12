package com.aesp.backend.peer.handler;

import com.aesp.backend.peer.model.ChatMessage;
import com.aesp.backend.peer.model.PeerUserSession;
import com.aesp.backend.peer.model.Room;
import com.aesp.backend.peer.model.RoomStatus;
import com.aesp.backend.peer.service.PeerMatchService;
import com.aesp.backend.peer.service.TopicSuggestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class PeerWebSocketHandler extends TextWebSocketHandler {

    private final PeerMatchService matchService;
    private final TopicSuggestionService topicService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PeerWebSocketHandler(
            PeerMatchService matchService,
            TopicSuggestionService topicService
    ) {
        this.matchService = matchService;
        this.topicService = topicService;
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message
    ) throws Exception {

        // Đọc payload dạng JSON để kiểm tra type
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        String type = jsonNode.get("type") != null ? jsonNode.get("type").asText() : "";

        // Nếu là VOICE thì forward cho đối phương
        if (type.startsWith("VOICE_")) {
            String roomId = jsonNode.get("roomId") != null ? jsonNode.get("roomId").asText() : "";
            broadcastToPartner(roomId, session, message);
            return;
        }

        // Nếu không phải VOICE thì parse thành ChatMessage
        ChatMessage msg = objectMapper.readValue(message.getPayload(), ChatMessage.class);

        switch (msg.getType()) {
            case "JOIN" -> handleJoin(session, msg);
            case "CHAT" -> handleChat(msg);
            case "ROOM_FINISHED" -> handleRoomFinished(msg);
        }
    }

    private void handleJoin(WebSocketSession session, ChatMessage msg) throws Exception {
        System.out.println("Topic nhận được: " + msg.getContent());

        PeerUserSession user = new PeerUserSession(
                msg.getSender(),
                "BASIC",
                msg.getContent(),
                session
        );

        Room room = matchService.matchUser(user);

        if (room.getParticipants().size() == 2) {
            ChatMessage matched = new ChatMessage(
                    "MATCHED",
                    "SERVER",
                    "Matched successfully",
                    room.getRoomId(),
                    null
            );

            ChatMessage topicSuggestion;
            try {
                topicSuggestion = new ChatMessage(
                        "TOPIC_SUGGESTION",
                        "SERVER",
                        topicService.randomTopic(),
                        room.getRoomId(),
                        null
                );
            } catch (Exception e) {
                topicSuggestion = new ChatMessage(
                        "TOPIC_SUGGESTION",
                        "SERVER",
                        "Default topic",
                        room.getRoomId(),
                        null
                );
            }

            String matchedJson = objectMapper.writeValueAsString(matched);
            String topicJson = objectMapper.writeValueAsString(topicSuggestion);

            for (PeerUserSession p : room.getParticipants()) {
                if (p.getSession().isOpen()) {
                    p.getSession().sendMessage(new TextMessage(matchedJson));
                    p.getSession().sendMessage(new TextMessage(topicJson));
                }
            }
        } else {
            ChatMessage waiting = new ChatMessage(
                    "WAITING",
                    "SERVER",
                    "Waiting...",
                    room.getRoomId(),
                    null
            );
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(waiting)));
        }
    }

    private void handleChat(ChatMessage msg) throws Exception {
        Room room = matchService.findRoomById(msg.getRoomId());
        if (room == null) return;

        for (PeerUserSession p : room.getParticipants()) {
            if (p.getSession().isOpen()) {
                p.getSession().sendMessage(
                        new TextMessage(objectMapper.writeValueAsString(msg))
                );
            }
        }
    }

    private void handleRoomFinished(ChatMessage msg) throws Exception {
        Room room = matchService.findRoomById(msg.getRoomId());
        if (room == null) return;

        room.setStatus(RoomStatus.FINISHED);

        ChatMessage notify = new ChatMessage(
                "ROOM_FINISHED",
                "SERVER",
                "Cuộc trò chuyện đã kết thúc",
                room.getRoomId(),
                null
        );

        for (PeerUserSession p : room.getParticipants()) {
            if (p.getSession().isOpen()) {
                p.getSession().sendMessage(
                        new TextMessage(objectMapper.writeValueAsString(notify))
                );
            }
        }

        matchService.removeRoom(room.getRoomId());
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {

        Room room = matchService.findRoomBySession(session);
        if (room == null) return;

        ChatMessage offline = new ChatMessage(
                "USER_OFFLINE",
                "SERVER",
                "Đối phương đã rời phòng",
                room.getRoomId(),
                null
        );

        try {
            for (PeerUserSession p : room.getParticipants()) {
                if (p.getSession().isOpen()
                        && !p.getSession().equals(session)) {

                    p.getSession().sendMessage(
                            new TextMessage(objectMapper.writeValueAsString(offline))
                    );
                }
            }
        } catch (Exception ignored) {}

        matchService.removeRoom(room.getRoomId());
    }

    private void broadcastToPartner(String roomId, WebSocketSession sender, TextMessage message) {
        Room room = matchService.findRoomById(roomId);
        if (room == null) return;

        for (PeerUserSession p : room.getParticipants()) {
            try {
                if (!p.getSession().getId().equals(sender.getId()) && p.getSession().isOpen()) {
                    p.getSession().sendMessage(message);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}