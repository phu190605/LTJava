package com.aesp.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
// Bỏ Lombok
import org.hibernate.annotations.CreationTimestamp;
import com.aesp.backend.entity.WordDetail;

@Entity
@Table(name = "speech_assessments")
public class SpeechAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String referenceText;

    private String audioUrl;

    private Double accuracyScore;
    private Double fluencyScore;
    private Double completenessScore;
    private Double prosodyScore;
    private Double overallScore;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "speechAssessment", cascade = CascadeType.ALL)
    private List<WordDetail> wordDetails;

    public SpeechAssessment() {
    }

    // Getter & Setter cho tất cả trường
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getReferenceText() {
        return referenceText;
    }

    public void setReferenceText(String referenceText) {
        this.referenceText = referenceText;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public Double getAccuracyScore() {
        return accuracyScore;
    }

    public void setAccuracyScore(Double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }

    public Double getFluencyScore() {
        return fluencyScore;
    }

    public void setFluencyScore(Double fluencyScore) {
        this.fluencyScore = fluencyScore;
    }

    public Double getCompletenessScore() {
        return completenessScore;
    }

    public void setCompletenessScore(Double completenessScore) {
        this.completenessScore = completenessScore;
    }

    public Double getProsodyScore() {
        return prosodyScore;
    }

    public void setProsodyScore(Double prosodyScore) {
        this.prosodyScore = prosodyScore;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<WordDetail> getWordDetails() {
        return wordDetails;
    }

    public void setWordDetails(List<WordDetail> wordDetails) {
        this.wordDetails = wordDetails;
    }
}