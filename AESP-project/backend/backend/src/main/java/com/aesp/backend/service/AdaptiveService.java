package com.aesp.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.aesp.backend.dto.request.AdaptiveLearningRequest;
import com.aesp.backend.dto.response.AdaptiveLearningResponse;
import com.aesp.backend.event.SessionCompletedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdaptiveService {

    /**
     * Adjusts learning path based on user's recent session statistics
     */
    public AdaptiveLearningResponse adjustLearningPath(AdaptiveLearningRequest request) {
        log.info("Adjusting learning path for user: {}", request.getUserId());
        
        List<AdaptiveLearningResponse.RecommendedLesson> recommendedLessons = new ArrayList<>();
        List<String> weakAreas = new ArrayList<>();
        
        // Check pronunciation scores for specific phonemes
        if (request.getPronunciationScore() != null && request.getPronunciationScore() < 50) {
            weakAreas.add("Overall Pronunciation");
            
            if (request.getPhonemeScores() != null) {
                for (Map.Entry<String, Double> entry : request.getPhonemeScores().entrySet()) {
                    String phoneme = entry.getKey();
                    Double score = entry.getValue();
                    
                    if (score < 50) {
                        weakAreas.add("Phoneme: " + phoneme);
                        
                        // Generate lesson recommendations for weak phonemes
                        AdaptiveLearningResponse.RecommendedLesson lesson = AdaptiveLearningResponse.RecommendedLesson.builder()
                                .lessonId("PHONEME_" + phoneme.toUpperCase())
                                .title("Master the /" + phoneme + "/ Sound")
                                .focusArea("Pronunciation - " + phoneme)
                                .description("Practice exercises focusing on the /" + phoneme + "/ phoneme with minimal pairs and targeted drills")
                                .priority(calculatePriority(score))
                                .build();
                        
                        recommendedLessons.add(lesson);
                    }
                }
            }
        }
        
        // Check grammar scores
        if (request.getGrammarScore() != null && request.getGrammarScore() < 50) {
            weakAreas.add("Grammar");
            
            if (request.getWeakGrammarTopics() != null && !request.getWeakGrammarTopics().isEmpty()) {
                for (String topic : request.getWeakGrammarTopics()) {
                    weakAreas.add("Grammar: " + topic);
                    
                    AdaptiveLearningResponse.RecommendedLesson lesson = AdaptiveLearningResponse.RecommendedLesson.builder()
                            .lessonId("GRAMMAR_" + topic.toUpperCase().replace(" ", "_"))
                            .title("Grammar Practice: " + topic)
                            .focusArea("Grammar - " + topic)
                            .description("Targeted exercises to improve your understanding of " + topic)
                            .priority(calculatePriority(request.getGrammarScore()))
                            .build();
                    
                    recommendedLessons.add(lesson);
                }
            }
        }
        
        // Sort lessons by priority (higher priority first)
        recommendedLessons.sort((a, b) -> b.getPriority().compareTo(a.getPriority()));
        
        String pathAdjustment = weakAreas.isEmpty() 
            ? "Great job! Your learning path is on track." 
            : "Learning path adjusted to focus on: " + String.join(", ", weakAreas);
        
        return AdaptiveLearningResponse.builder()
                .message("Learning path analysis completed")
                .recommendedLessons(recommendedLessons)
                .weakAreasIdentified(weakAreas)
                .learningPathAdjusted(pathAdjustment)
                .build();
    }
    
    /**
     * Calculate priority based on score (lower score = higher priority)
     */
    private Integer calculatePriority(Double score) {
        if (score == null) return 3;
        if (score < 30) return 5; // Critical
        if (score < 40) return 4; // High
        if (score < 50) return 3; // Medium
        if (score < 70) return 2; // Low
        return 1; // Very low
    }
    
    /**
     * Event listener for session completion
     * Processes learning path adjustment asynchronously
     */
    @Async
    @EventListener
    public void handleSessionCompleted(SessionCompletedEvent event) {
        log.info("Session completed event received for user: {}", event.getUserId());
        
        try {
            // Extract session stats
            Map<String, Object> stats = event.getSessionStats();
            
            AdaptiveLearningRequest request = new AdaptiveLearningRequest();
            request.setUserId(event.getUserId());
            
            // Extract scores from session stats
            if (stats.containsKey("pronunciationScore")) {
                request.setPronunciationScore(((Number) stats.get("pronunciationScore")).doubleValue());
            }
            
            if (stats.containsKey("grammarScore")) {
                request.setGrammarScore(((Number) stats.get("grammarScore")).doubleValue());
            }
            
            if (stats.containsKey("phonemeScores")) {
                @SuppressWarnings("unchecked")
                Map<String, Double> phonemeScores = (Map<String, Double>) stats.get("phonemeScores");
                request.setPhonemeScores(phonemeScores);
            }
            
            if (stats.containsKey("weakGrammarTopics")) {
                @SuppressWarnings("unchecked")
                List<String> weakTopics = (List<String>) stats.get("weakGrammarTopics");
                request.setWeakGrammarTopics(weakTopics);
            }
            
            // Process adaptive learning asynchronously
            AdaptiveLearningResponse response = adjustLearningPath(request);
            
            log.info("Adaptive learning completed for user {}: {} weak areas identified", 
                    event.getUserId(), response.getWeakAreasIdentified().size());
            
            // TODO: Save recommendations to user's priority queue in database
            // userService.updateLearningPath(event.getUserId(), response.getRecommendedLessons());
            
        } catch (Exception e) {
            log.error("Error processing session completed event for user: {}", event.getUserId(), e);
        }
    }
}
