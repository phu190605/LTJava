package com.aesp.backend.dto.request;

public class VocabQuestionScoreRequest {
    
    private Long enrollmentId;
    private Long questionId;
    private Integer score;
    private String userAnswer;
    private Boolean isCorrect;
    private Integer durationSeconds;
    private String audioUrl;
    
    // Constructors
    public VocabQuestionScoreRequest() {}
    
    public VocabQuestionScoreRequest(Long enrollmentId, Long questionId, Integer score, String userAnswer, Boolean isCorrect) {
        this.enrollmentId = enrollmentId;
        this.questionId = questionId;
        this.score = score;
        this.userAnswer = userAnswer;
        this.isCorrect = isCorrect;
    }
    
    // Getters and Setters
    public Long getEnrollmentId() {
        return enrollmentId;
    }
    
    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
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
    
    public Integer getDurationSeconds() {
        return durationSeconds;
    }
    
    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
    
    public String getAudioUrl() {
        return audioUrl;
    }
    
    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }
    
    @Override
    public String toString() {
        return "VocabQuestionScoreRequest{" +
                "enrollmentId=" + enrollmentId +
                ", questionId=" + questionId +
                ", score=" + score +
                ", userAnswer='" + userAnswer + '\'' +
                ", isCorrect=" + isCorrect +
                ", durationSeconds=" + durationSeconds +
                ", audioUrl='" + audioUrl + '\'' +
                '}';
    }
}
