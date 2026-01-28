package com.aesp.backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    private String learnerId;
    private String mentorId;

    private String audioUrl;

    @Column(columnDefinition = "TEXT")
    private String transcript;

    // AI reference scores
    private int aiGrammarScore;
    private int aiPronunciationScore;
    private String aiSuggestedLevel;

    // Mentor decision
    private String finalLevel;

    @Column(columnDefinition = "TEXT")
    private String mentorComment;

    private String status; // PENDING / DONE

    @PrePersist
    public void generateId() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }


    public String getId() {
        return id;
    }

    public String getLearnerId() {
        return learnerId;
    }

    public void setLearnerId(String learnerId) {
        this.learnerId = learnerId;
    }

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public int getAiGrammarScore() {
        return aiGrammarScore;
    }

    public void setAiGrammarScore(int aiGrammarScore) {
        this.aiGrammarScore = aiGrammarScore;
    }

    public int getAiPronunciationScore() {
        return aiPronunciationScore;
    }

    public void setAiPronunciationScore(int aiPronunciationScore) {
        this.aiPronunciationScore = aiPronunciationScore;
    }

    public String getAiSuggestedLevel() {
        return aiSuggestedLevel;
    }

    public void setAiSuggestedLevel(String aiSuggestedLevel) {
        this.aiSuggestedLevel = aiSuggestedLevel;
    }

    public String getFinalLevel() {
        return finalLevel;
    }

    public void setFinalLevel(String finalLevel) {
        this.finalLevel = finalLevel;
    }

    public String getMentorComment() {
        return mentorComment;
    }

    public void setMentorComment(String mentorComment) {
        this.mentorComment = mentorComment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
