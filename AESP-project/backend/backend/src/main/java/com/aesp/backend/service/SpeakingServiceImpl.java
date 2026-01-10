package com.aesp.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Random;

@Service
public class SpeakingServiceImpl implements SpeakingService {

    @Override
    public int calculateScore(MultipartFile audio) {
        // MOCK: Giả lập chấm điểm từ 60 đến 90
        return new Random().nextInt(31) + 60;
    }

    @Override
    public String generateFeedback(int score) {
        if (score >= 85) return "Phát âm rất tốt, gần như người bản xứ.";
        if (score >= 70) return "Phát âm ổn, cần cải thiện ngữ điệu.";
        return "Phát âm yếu, cần luyện thêm.";
    }


    @Override
    public String evaluateLevel(int score) {
        if (score >= 85) {
            return "Advanced";
        } else if (score >= 70) {
            return "Intermediate";
        } else {
            return "Beginner";
        }
    }
}