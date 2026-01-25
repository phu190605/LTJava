package com.aesp.backend.dto.response;

import java.time.LocalDateTime;

public class SpeakingResultDTO {
    private final Long id;
    private final Long userId;
    private final int partNumber;
    private final int score;
    private final String feedback;
    private final String audioUrl;
    private final String referenceText;
    private final LocalDateTime createdAt;

    public SpeakingResultDTO(Long id, Long userId, int partNumber, int score, String feedback, String audioUrl,
            String referenceText,
            LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.partNumber = partNumber;
        this.score = score;
        this.feedback = feedback;
        this.audioUrl = audioUrl;
        this.referenceText = referenceText;
        this.createdAt = createdAt;
    }

    public String getReferenceText() {
        return referenceText;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public int getPartNumber() {
        return partNumber;
    }

    public int getScore() {
        return score;
    }

    public String getFeedback() {
        return feedback;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
