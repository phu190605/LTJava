package com.aesp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.aesp.backend.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Tìm tin nhắn theo Topic và sắp xếp cũ nhất trước (để hiển thị từ trên xuống)
    List<ChatMessage> findByTopicIdOrderByCreatedAtAsc(Long topicId);
    @Transactional
    void deleteByTopicId(Long topicId);
}