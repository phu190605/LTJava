package com.aesp.backend.controller;

import com.aesp.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/ask")
    public ResponseEntity<String> chat(@RequestBody String message) {
        String response = geminiService.chatWithAI(message);
        return ResponseEntity.ok(response);
    }
}