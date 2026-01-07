package com.aesp.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.entity.PracticeSentence;
import com.aesp.backend.entity.ProficiencyLevel;
import com.aesp.backend.service.SentenceService;

@RestController
@RequestMapping("/api/sentences")
public class SentenceController {
    
    @Autowired
    private SentenceService sentenceService;
    
    /**
     * Get a practice sentence (from DB or AI)
     * GET /api/sentences/practice?topic=Travel&level=BEGINNER&forceAI=false&excludedSentences=sentence1|||sentence2|||sentence3
     */
    @GetMapping("/practice")
    public ResponseEntity<Map<String, Object>> getPracticeSentence(
            @RequestParam(required = false, defaultValue = "Daily life") String topic,
            @RequestParam(required = false, defaultValue = "BEGINNER") String level,
            @RequestParam(required = false, defaultValue = "false") boolean forceAI,
            @RequestParam(required = false) String excludedSentences) {
        
        try {
            ProficiencyLevel profLevel = ProficiencyLevel.valueOf(level.toUpperCase());
            String sentence = sentenceService.getSentence(topic, profLevel, forceAI, excludedSentences);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sentence", sentence);
            response.put("topic", topic);
            response.put("level", level);
            response.put("source", forceAI ? "AI" : "DB or AI");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Invalid level. Use: BEGINNER, INTERMEDIATE, ADVANCED");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get sentence: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get all sentences for a topic and level
     * GET /api/sentences/list?topic=Travel&level=BEGINNER
     */
    @GetMapping("/list")
    public ResponseEntity<List<PracticeSentence>> getSentences(
            @RequestParam String topic,
            @RequestParam String level) {
        
        try {
            ProficiencyLevel profLevel = ProficiencyLevel.valueOf(level.toUpperCase());
            List<PracticeSentence> sentences = sentenceService.getSentencesByTopicAndLevel(topic, profLevel);
            return ResponseEntity.ok(sentences);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Manually add a sentence to DB
     * POST /api/sentences/add
     * Body: { "topic": "Travel", "level": "BEGINNER", "sentence": "I love traveling." }
     */
    @PostMapping("/add")
    public ResponseEntity<PracticeSentence> addSentence(@RequestBody Map<String, String> request) {
        try {
            String topic = request.get("topic");
            String levelStr = request.get("level");
            String sentence = request.get("sentence");
            
            if (topic == null || levelStr == null || sentence == null) {
                return ResponseEntity.badRequest().build();
            }
            
            ProficiencyLevel level = ProficiencyLevel.valueOf(levelStr.toUpperCase());
            PracticeSentence saved = sentenceService.saveSentence(topic, level, sentence);
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
