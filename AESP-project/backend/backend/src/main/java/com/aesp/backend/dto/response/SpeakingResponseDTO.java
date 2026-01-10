package com.aesp.backend.dto.response;

public class SpeakingResponseDTO {
    private int score;
    private String feedback;

    public SpeakingResponseDTO(int score, String feedback) {
        this.score = score;
        this.feedback = feedback;
    }

    public int getScore() { return score; }
    public String getFeedback() { return feedback; }
}
