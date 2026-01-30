package com.aesp.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vocab_question_attempts")
public class VocabQuestionAttempt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private UserLearningPath enrollment;
    
    @ManyToOne
    @JoinColumn(name = "vocab_question_id", nullable = false)
    private LearningPathVocabQuestion question;
    
    @Column(name = "score")
    private Integer score;
    
    @Column(name = "user_answer")
    private String userAnswer;
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(name = "attempted_at")
    private LocalDateTime attemptedAt;
    
    @Column(name = "duration_seconds")
    private Integer durationSeconds;
    
    @Column(name = "attempt_count")
    private Integer attemptCount;
    
    @Column(name = "audio_url", length = 500)
    private String audioUrl;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public VocabQuestionAttempt() {}
    
    public VocabQuestionAttempt(UserLearningPath enrollment, LearningPathVocabQuestion question, 
                                Integer score, String userAnswer, Boolean isCorrect) {
        this.enrollment = enrollment;
        this.question = question;
        this.score = score;
        this.userAnswer = userAnswer;
        this.isCorrect = isCorrect;
        this.attemptedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public UserLearningPath getEnrollment() {
        return enrollment;
    }
    
    public void setEnrollment(UserLearningPath enrollment) {
        this.enrollment = enrollment;
    }
    
    public LearningPathVocabQuestion getQuestion() {
        return question;
    }
    
    public void setQuestion(LearningPathVocabQuestion question) {
        this.question = question;
    }
    
    public Integer getScore() {
        return score;
    }
    
    public void setScore(Integer score) {
        this.score = score;
    }
    
    public String getUserAnswer() {
        return userAnswer;
    }
    
    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }
    
    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
    
    public Integer getDurationSeconds() {
        return durationSeconds;
    }
    
    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
    
    public Integer getAttemptCount() {
        return attemptCount;
    }
    
    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }
    
    public String getAudioUrl() {
        return audioUrl;
    }
    
    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}