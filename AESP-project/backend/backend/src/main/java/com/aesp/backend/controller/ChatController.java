package com.aesp.backend.controller;

import com.aesp.backend.entity.ChatMessage;
import com.aesp.backend.repository.ChatMessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatController {

    private final ChatMessageRepository chatRepo;

    public ChatController(ChatMessageRepository chatRepo) {
        this.chatRepo = chatRepo;
    }

    @GetMapping("/history/{conversationId}")
    public List<ChatMessage> getHistory(@PathVariable Long conversationId) {
        return chatRepo.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}
