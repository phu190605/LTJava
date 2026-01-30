package com.aesp.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.service.AIServiceManager; // <--- Thay đổi import

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class PracticeChatController {

    // Thay vì gọi GeminiService, ta gọi Manager
    @Autowired
    private AIServiceManager aiServiceManager; 

    @PostMapping("/ask")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> payload) {
        String message = payload.getOrDefault("message", "");
        
        // Manager sẽ tự động chọn Groq (Free) trước, nếu lỗi mới gọi Gemini
        String response = aiServiceManager.chatWithAI(message);
        
        return ResponseEntity.ok(response);
    }
}