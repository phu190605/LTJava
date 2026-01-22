package com.aesp.backend.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aesp.backend.entity.PracticeSentence;
import com.aesp.backend.entity.ProficiencyLevel;
import com.aesp.backend.repository.PracticeSentenceRepository;

@Service
public class SentenceService {
    
    private static final Logger logger = LoggerFactory.getLogger(SentenceService.class);
    
    @Autowired
    private PracticeSentenceRepository sentenceRepository;
    
    @Autowired
    private GeminiService geminiService;
    
    /**
     * Get a practice sentence - try DB first (excluding previous), fallback to AI generation
     * @param topic Topic/category (Travel, Daily life, Business, etc.)
     * @param level Proficiency level
     * @param forceAI If true, skip DB and generate new sentence with AI
     * @param excludedSentencesStr Previous sentences to exclude (avoid duplicates), separated by |||
     * @return Practice sentence
     */
    @Transactional
    public String getSentence(String topic, ProficiencyLevel level, boolean forceAI, String excludedSentencesStr) {
        // Parse excluded sentences
        java.util.Set<String> excludedSet = new java.util.HashSet<>();
        if (excludedSentencesStr != null && !excludedSentencesStr.trim().isEmpty()) {
            String[] excluded = excludedSentencesStr.split("\\|\\|\\|");
            for (String s : excluded) {
                if (!s.trim().isEmpty()) {
                    excludedSet.add(s.trim());
                }
            }
        }

        // If forceAI is false, try to get from DB first (excluding all previous sentences)
        if (!forceAI && !excludedSet.isEmpty()) {
            List<PracticeSentence> candidates = sentenceRepository.findByTopicAndLevel(topic, level);
            for (PracticeSentence sentence : candidates) {
                if (!excludedSet.contains(sentence.getSentence())) {
                    sentence.setUsedCount(sentence.getUsedCount() + 1);
                    sentenceRepository.save(sentence);
                    logger.info("[SentenceService] Retrieved different sentence from DB: topic={}, level={}", topic, level);
                    return sentence.getSentence();
                }
            }
            // If all sentences in DB are excluded, generate with AI
            logger.info("[SentenceService] All DB sentences excluded, generating new one with AI");
        } else if (!forceAI) {
            // No excluded sentences, just get any random one
            Optional<PracticeSentence> existing = sentenceRepository.findRandomByTopicAndLevel(topic, level.name());
            if (existing.isPresent()) {
                PracticeSentence sentence = existing.get();
                sentence.setUsedCount(sentence.getUsedCount() + 1);
                sentenceRepository.save(sentence);
                logger.info("[SentenceService] Retrieved sentence from DB: topic={}, level={}", topic, level);
                return sentence.getSentence();
            }
        }
        
        // Generate new sentence using AI
        logger.info("[SentenceService] Generating new sentence with AI: topic={}, level={}", topic, level);
        String generatedSentence = generateSentenceWithAI(topic, level);
        
        // Save to DB for future use
        try {
            PracticeSentence newSentence = new PracticeSentence(topic, level, generatedSentence);
            sentenceRepository.save(newSentence);
            logger.info("[SentenceService] Saved new sentence to DB");
        } catch (Exception e) {
            logger.warn("[SentenceService] Failed to save sentence to DB: {}", e.getMessage());
        }
        
        return generatedSentence;
    }
    
    /**
     * Generate sentence using AI
     */
    private String generateSentenceWithAI(String topic, ProficiencyLevel level) {
        String prompt = String.format(
            "Give me 1 short English sentence about '%s' for %s level. " +
            "Just the sentence, no explanation. Keep it natural and conversational.",
            topic, level.name()
        );
        
        String response = geminiService.chatWithAI(prompt);
        
        // Clean up response (remove quotes, extra text, etc.)
        response = response.trim();
        if (response.startsWith("\"") && response.endsWith("\"")) {
            response = response.substring(1, response.length() - 1);
        }
        
        return response;
    }
    
    /**
     * Get all sentences for a specific topic and level
     */
    public List<PracticeSentence> getSentencesByTopicAndLevel(String topic, ProficiencyLevel level) {
        return sentenceRepository.findByTopicAndLevel(topic, level);
    }
    
    /**
     * Get all sentences for a topic
     */
    public List<PracticeSentence> getSentencesByTopic(String topic) {
        return sentenceRepository.findByTopic(topic);
    }
    
    /**
     * Manually save a sentence to DB
     */
    @Transactional
    public PracticeSentence saveSentence(String topic, ProficiencyLevel level, String sentence) {
        PracticeSentence newSentence = new PracticeSentence(topic, level, sentence);
        return sentenceRepository.save(newSentence);
    }
}
