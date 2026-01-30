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

import com.aesp.backend.entity.PracticeChatMessage;
import com.aesp.backend.repository.PracticeChatMessageRepository;

@RestController
@RequestMapping("/api/chat-history")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatHistoryController {

    @Autowired
    private PracticeChatMessageRepository chatMessageRepository;

    // 1. Lấy lịch sử chat của một Topic
    @GetMapping("/{topicId}")
    public List<PracticeChatMessage> getHistoryByTopic(@PathVariable Long topicId) {
        return chatMessageRepository.findByTopicIdOrderByCreatedAtAsc(topicId);
    }

    // 2. Lưu tin nhắn mới
    @PostMapping
    public PracticeChatMessage saveMessage(@RequestBody PracticeChatMessage message) {
        return chatMessageRepository.save(message);
    }
    @DeleteMapping("/{topicId}")
    public void clearHistory(@PathVariable Long topicId) {
        chatMessageRepository.deleteByTopicId(topicId);
    }
}