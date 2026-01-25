package com.aesp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class WordResult {
    private String word; // Từ: "cat"
    private double accuracyScore; // Điểm của riêng từ này: 45.0
    private String errorType; // Loại lỗi: "Mispronunciation" (Sai), "Omission" (Thiếu), "None" (Đúng)

    public WordResult() {
    }

    public WordResult(String word, double accuracyScore, String errorType) {
        this.word = word;
        this.accuracyScore = accuracyScore;
        this.errorType = errorType;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public double getAccuracyScore() {
        return accuracyScore;
    }

    public void setAccuracyScore(double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }

    public String getErrorType() {
        return errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }
}
