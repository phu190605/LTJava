package com.aesp.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.entity.Topic;
import com.aesp.backend.repository.TopicRepository;

@RestController
@RequestMapping("/api/topics")
// ⚠️ Thay đổi http://localhost:5173 bằng port Frontend của bạn nếu khác
@CrossOrigin(origins = "http://localhost:5173") 
public class TopicController {

    @Autowired
    private TopicRepository topicRepository;

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicRepository.findAll(); // Lấy tất cả chủ đề từ data.sql
    }
}