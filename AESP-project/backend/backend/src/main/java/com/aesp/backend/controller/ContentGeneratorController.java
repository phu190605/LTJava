package com.aesp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.dto.request.GenerateContentRequest;
import com.aesp.backend.dto.response.GeneratedScenarioResponse;
import com.aesp.backend.service.ContentGeneratorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContentGeneratorController {

    private final ContentGeneratorService contentGeneratorService;

    /**
     * Generate AI-powered remedial exercise based on user's weak points
     */
    @PostMapping("/generate")
    public ResponseEntity<GeneratedScenarioResponse> generateContent(
            @RequestBody GenerateContentRequest request) {
        
        // Validate request
        if (request.getTopic() == null || request.getTopic().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (request.getWeakPoints() == null || request.getWeakPoints().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        GeneratedScenarioResponse response = contentGeneratorService.generateRemedialExercise(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Generate quick practice scenario for specific grammar point
     */
    @GetMapping("/quick-practice")
    public ResponseEntity<GeneratedScenarioResponse> generateQuickPractice(
            @RequestParam String grammarPoint,
            @RequestParam(required = false, defaultValue = "intermediate") String level) {
        
        GenerateContentRequest request = new GenerateContentRequest();
        request.setTopic("General Conversation");
        request.setWeakPoints(java.util.List.of(grammarPoint));
        request.setDifficultyLevel(level);
        request.setNumberOfDialogues(6);
        
        GeneratedScenarioResponse response = contentGeneratorService.generateRemedialExercise(request);
        return ResponseEntity.ok(response);
    }
}
