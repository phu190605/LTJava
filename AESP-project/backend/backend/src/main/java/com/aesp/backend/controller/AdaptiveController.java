package com.aesp.backend.controller;

import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.dto.request.AdaptiveLearningRequest;
import com.aesp.backend.dto.response.AdaptiveLearningResponse;
import com.aesp.backend.event.SessionCompletedEvent;
import com.aesp.backend.service.AdaptiveService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/adaptive")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdaptiveController {

    private final AdaptiveService adaptiveService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Recalculate learning path based on recent session stats
     * Called after user completes a speaking session
     */
    @PostMapping("/recalc")
    public ResponseEntity<AdaptiveLearningResponse> recalculateLearningPath(
            @RequestBody AdaptiveLearningRequest request) {
        
        AdaptiveLearningResponse response = adaptiveService.adjustLearningPath(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Trigger session completed event (async processing)
     * This endpoint can be called to fire the event without waiting for processing
     */
    @PostMapping("/session-completed")
    public ResponseEntity<Map<String, String>> triggerSessionCompleted(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> sessionStats) {
        
        // Publish event for async processing
        SessionCompletedEvent event = new SessionCompletedEvent(this, userId, sessionStats);
        eventPublisher.publishEvent(event);
        
        return ResponseEntity.ok(Map.of(
                "message", "Session completed event published successfully",
                "userId", userId.toString()
        ));
    }
}
