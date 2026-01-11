package com.aesp.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.entity.ChatMessage;
import com.aesp.backend.repository.ChatMessageRepository;

@RestController
@RequestMapping("/api/chat-history")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // 1. Lấy lịch sử chat của một Topic
    @GetMapping("/{topicId}")
    public List<ChatMessage> getHistoryByTopic(@PathVariable Long topicId) {
        return chatMessageRepository.findByTopicIdOrderByCreatedAtAsc(topicId);
    }

    // 2. Lưu tin nhắn mới
    @PostMapping
    public ChatMessage saveMessage(@RequestBody ChatMessage message) {
        return chatMessageRepository.save(message);
    }
    @DeleteMapping("/{topicId}")
    public void clearHistory(@PathVariable Long topicId) {
        chatMessageRepository.deleteByTopicId(topicId);
    }
}