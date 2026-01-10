package com.aesp.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface SpeakingService {
    int calculateScore(MultipartFile audio);
    String generateFeedback(int score);
    String evaluateLevel(int score);
}
