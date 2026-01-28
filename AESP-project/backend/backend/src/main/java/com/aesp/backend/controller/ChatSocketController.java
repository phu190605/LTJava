package com.aesp.backend.controller;

import com.aesp.backend.entity.ChatMessage;
import com.aesp.backend.repository.ChatMessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatSocketController {

    private final ChatMessageRepository chatRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatSocketController(
            ChatMessageRepository chatRepo,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.chatRepo = chatRepo;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void send(ChatMessage message) {

        message.setCreatedAt(LocalDateTime.now());

        ChatMessage saved = chatRepo.save(message);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getConversationId(),
                saved
        );
    }
}
