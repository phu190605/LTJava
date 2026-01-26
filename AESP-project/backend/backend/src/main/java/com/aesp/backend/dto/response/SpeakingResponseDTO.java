package com.aesp.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SpeakingResponseDTO {
    private String email;
    private String level;
    private Integer score;
    private String feedback;

    // QUAN TRỌNG: Thêm Constructor không tham số này để sửa lỗi 400
    public SpeakingResponseDTO() {
    }

    // CONSTRUCTOR 1: Cho nộp bài test tổng
    public SpeakingResponseDTO(String email, String level) {
        this.email = email;
        this.level = level;
    }

    // CONSTRUCTOR 2: Cho Speaking lẻ
    public SpeakingResponseDTO(int score, String feedback) {
        this.score = score;
        this.feedback = feedback;
    }

    // Getters and Setters...
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}