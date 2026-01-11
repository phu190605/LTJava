package com.aesp.backend.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ModerationService {

    // Blacklist of toxic words (sample - extend as needed)
    private static final Set<String> BLACKLIST = new HashSet<>(Arrays.asList(
            "fuck", "shit", "damn", "bastard", "asshole", "bitch",
            "idiot", "stupid", "hate", "kill", "die"
            // Add more words as needed
    ));

    // Patterns for more sophisticated detection
    private static final List<Pattern> TOXIC_PATTERNS = Arrays.asList(
            Pattern.compile("\\b(fuck|shit|damn)\\w*\\b", Pattern.CASE_INSENSITIVE),
            Pattern.compile("\\b(hate|kill|die)\\s+(you|them|him|her)\\b", Pattern.CASE_INSENSITIVE)
    );

    /**
     * Check if text contains toxic content
     * @param text The text to check
     * @return true if toxic content is detected, false otherwise
     */
    public boolean containsToxicContent(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }

        String lowerText = text.toLowerCase();

        // Check against blacklist
        for (String word : BLACKLIST) {
            if (lowerText.contains(word)) {
                log.warn("Toxic content detected: blacklisted word '{}' found in text", word);
                return true;
            }
        }

        // Check against patterns
        for (Pattern pattern : TOXIC_PATTERNS) {
            if (pattern.matcher(text).find()) {
                log.warn("Toxic content detected: pattern matched in text");
                return true;
            }
        }

        return false;
    }

    /**
     * Moderate text and return sanitized version
     * @param text The text to moderate
     * @return Sanitized text with toxic words replaced
     */
    public String moderateText(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        String moderatedText = text;

        // Replace blacklisted words with asterisks
        for (String word : BLACKLIST) {
            String replacement = "*".repeat(word.length());
            moderatedText = moderatedText.replaceAll("(?i)" + Pattern.quote(word), replacement);
        }

        return moderatedText;
    }

    /**
     * Get detailed moderation result
     * @param text The text to check
     * @return ModerationResult with details
     */
    public ModerationResult moderateWithDetails(String text) {
        if (text == null || text.isEmpty()) {
            return new ModerationResult(true, text, Collections.emptyList());
        }

        List<String> flaggedWords = new ArrayList<>();
        String lowerText = text.toLowerCase();

        // Collect all flagged words
        for (String word : BLACKLIST) {
            if (lowerText.contains(word)) {
                flaggedWords.add(word);
            }
        }

        boolean isClean = flaggedWords.isEmpty();
        String moderatedText = isClean ? text : moderateText(text);

        return new ModerationResult(isClean, moderatedText, flaggedWords);
    }

    /**
     * Simulate calling an external moderation API (like OpenAI Moderation API)
     * @param text The text to check
     * @return ModerationResult
     */
    public ModerationResult moderateWithExternalAPI(String text) {
        // In production, call actual API like:
        // - OpenAI Moderation API
        // - Perspective API
        // - Azure Content Moderator
        
        log.info("Simulating external API call for moderation");
        
        // For now, use internal logic
        ModerationResult result = moderateWithDetails(text);
        
        // Add simulated API categories
        if (!result.isClean()) {
            log.warn("Content flagged by moderation: {} words detected", result.getFlaggedWords().size());
        }
        
        return result;
    }

    /**
     * Result object for moderation
     */
    public static class ModerationResult {
        private final boolean isClean;
        private final String moderatedText;
        private final List<String> flaggedWords;

        public ModerationResult(boolean isClean, String moderatedText, List<String> flaggedWords) {
            this.isClean = isClean;
            this.moderatedText = moderatedText;
            this.flaggedWords = flaggedWords;
        }

        public boolean isClean() {
            return isClean;
        }

        public String getModeratedText() {
            return moderatedText;
        }

        public List<String> getFlaggedWords() {
            return flaggedWords;
        }

        public String getReason() {
            if (isClean) {
                return "Content is clean";
            }
            return "Flagged words detected: " + String.join(", ", flaggedWords);
        }
    }
}
