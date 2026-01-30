package com.aesp.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "chat_messages")
@Data
public class PracticeChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long topicId; // Gắn tin nhắn với chủ đề cụ thể

    @Column(columnDefinition = "TEXT")
    private String text;

    private String sender; // 'user' hoặc 'ai'

    private LocalDateTime createdAt = LocalDateTime.now();
}