package com.aesp.backend.dto.response;

import java.util.List;

public class AssessmentResult {
    // Thứ tự khai báo các biến dưới đây phải KHỚP 100% với file Service
    private String level;
    private double overallScore;
    private String feedback;
    private double accuracyScore;
    private double fluencyScore;
    private double completenessScore;
    private double prosodyScore;
    private List<WordResult> words;
    private String audioUrl; // Thêm trường audioUrl

    // --- CONSTRUCTOR THỦ CÔNG (Thêm đoạn này là hết lỗi ngay) ---
    public AssessmentResult(String level, double overallScore, String feedback,
            double accuracyScore, double fluencyScore,
            double completenessScore, double prosodyScore,
            List<WordResult> words, String audioUrl) {
        this.level = level;
        this.overallScore = overallScore;
        this.feedback = feedback;
        this.accuracyScore = accuracyScore;
        this.fluencyScore = fluencyScore;
        this.completenessScore = completenessScore;
        this.prosodyScore = prosodyScore;
        this.words = words;
        this.audioUrl = audioUrl;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(double overallScore) {
        this.overallScore = overallScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public double getAccuracyScore() {
        return accuracyScore;
    }

    public void setAccuracyScore(double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }

    public double getFluencyScore() {
        return fluencyScore;
    }

    public void setFluencyScore(double fluencyScore) {
        this.fluencyScore = fluencyScore;
    }

    public double getCompletenessScore() {
        return completenessScore;
    }

    public void setCompletenessScore(double completenessScore) {
        this.completenessScore = completenessScore;
    }

    public double getProsodyScore() {
        return prosodyScore;
    }

    public void setProsodyScore(double prosodyScore) {
        this.prosodyScore = prosodyScore;
    }

    public List<WordResult> getWords() {
        return words;
    }

    public void setWords(List<WordResult> words) {
        this.words = words;
    }
}
