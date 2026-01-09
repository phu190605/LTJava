@Override
protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

    ChatMessage msg = objectMapper.readValue(message.getPayload(), ChatMessage.class);

    switch (msg.getType()) {
        case "JOIN" -> handleJoin(session, msg);
        case "CHAT" -> handleChat(msg);
        case "ROOM_FINISHED" -> handleRoomFinished(msg);
    }
}

private void handleJoin(WebSocketSession session, ChatMessage msg) throws Exception {

    PeerUserSession user = new PeerUserSession(
            msg.getSender(), "BASIC", msg.getContent(), session
    );

    Room room = matchService.matchUser(user);

    if (room.getParticipants().size() == 2) {

        ChatMessage matched = new ChatMessage(
                "MATCHED", "SERVER", "Matched", room.getRoomId(), null
        );

        ChatMessage topic = new ChatMessage(
                "TOPIC_SUGGESTION", "SERVER",
                topicService.randomTopic(),
                room.getRoomId(), null
        );

        for (PeerUserSession p : room.getParticipants()) {
            p.getSession().sendMessage(new TextMessage(
                    objectMapper.writeValueAsString(matched)
            ));
            p.getSession().sendMessage(new TextMessage(
                    objectMapper.writeValueAsString(topic)
            ));
        }
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
            "ROOM_FINISHED", "SERVER",
            "Cuộc trò chuyện đã kết thúc",
            room.getRoomId(), null
    );

    for (PeerUserSession p : room.getParticipants()) {
        if (p.getSession().isOpen()) {
            p.getSession().sendMessage(
                    new TextMessage(objectMapper.writeValueAsString(notify))
            );
        }
    }
}
