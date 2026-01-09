package com.aesp.backend.entity;

import jakarta.persistence.*;

@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String sessionId;
    private String mentorId;
    private String learnerId;

    @Column(columnDefinition = "TEXT")
    private String comment;

    private int grammarScore;
    private int pronunciationScore;

    private int timeStamp; // mốc thời gian trong audio (giây)

    // ===== GETTERS =====
    public String getId() {
        return id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getMentorId() {
        return mentorId;
    }

    public String getLearnerId() {
        return learnerId;
    }

    public String getComment() {
        return comment;
    }

    public int getGrammarScore() {
        return grammarScore;
    }

    public int getPronunciationScore() {
        return pronunciationScore;
    }

    public int getTimeStamp() {
        return timeStamp;
    }

    // ===== SETTERS =====
    public void setId(String id) {
        this.id = id;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public void setLearnerId(String learnerId) {
        this.learnerId = learnerId;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setGrammarScore(int grammarScore) {
        this.grammarScore = grammarScore;
    }

    public void setPronunciationScore(int pronunciationScore) {
        this.pronunciationScore = pronunciationScore;
    }

    public void setTimeStamp(int timeStamp) {
        this.timeStamp = timeStamp;
    }
}
