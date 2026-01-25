package com.aesp.backend.entity;

import jakarta.persistence.*;
// Bỏ Lombok
import com.fasterxml.jackson.annotation.JsonIgnore; // Import thêm cái này
import com.aesp.backend.entity.SpeechAssessment;

@Entity
@Table(name = "word_details") // Nên đặt tên bảng rõ ràng
public class WordDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    @JsonIgnore
    private SpeechAssessment speechAssessment;

    private String word;
    private Double accuracyScore;
    private String errorType;

    public WordDetail() {
    }

    // Getter & Setter cho tất cả trường
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SpeechAssessment getSpeechAssessment() {
        return speechAssessment;
    }

    public void setSpeechAssessment(SpeechAssessment speechAssessment) {
        this.speechAssessment = speechAssessment;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public Double getAccuracyScore() {
        return accuracyScore;
    }

    public void setAccuracyScore(Double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }

    public String getErrorType() {
        return errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }
}