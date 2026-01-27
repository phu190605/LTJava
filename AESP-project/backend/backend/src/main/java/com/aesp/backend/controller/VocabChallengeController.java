package com.aesp.backend.controller;

import com.aesp.backend.entity.VocabQuestion;
import com.aesp.backend.repository.VocabQuestionRepository;
import com.aesp.backend.service.GamificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vocab-challenge")
public class VocabChallengeController {
    @Autowired
    private VocabQuestionRepository vocabQuestionRepository;
    @Autowired
    private GamificationService gamificationService;
    @Autowired
    private com.aesp.backend.repository.UserChallengeProgressRepository progressRepository;
    @Autowired
    private com.aesp.backend.repository.ChallengeRepository challengeRepository;

    // API lấy 5 câu hỏi từ vựng random
    @GetMapping("/questions")
    public List<VocabQuestion> getQuestions(@RequestParam(required = false) String topic) {
        if (topic != null && !topic.isEmpty()) {
            return vocabQuestionRepository.findRandomByTopic(topic);
        }
        return vocabQuestionRepository.findRandomQuestions();
    }

    // API nộp đáp án, tính điểm và cộng XP
    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswers(@RequestBody Map<Long, String> answers, @RequestParam Long userId,
            @RequestParam Long challengeId) {
        int correct = 0;
        for (Map.Entry<Long, String> entry : answers.entrySet()) {
            VocabQuestion q = vocabQuestionRepository.findById(entry.getKey()).orElse(null);
            if (q != null && q.getAnswer().equalsIgnoreCase(entry.getValue().trim())) {
                correct++;
            }
        }
        int xp = correct * 10;
        gamificationService.addXpToUser(userId, xp); // Cần bổ sung hàm này trong service

        // Đánh dấu challenge đã hoàn thành hôm nay cho user
        java.time.LocalDate today = java.time.LocalDate.now();
        com.aesp.backend.entity.UserChallengeProgress progress = progressRepository
                .findByUserIdAndChallengeIdAndDate(userId, challengeId, today)
                .orElse(null);
        if (progress == null) {
            progress = new com.aesp.backend.entity.UserChallengeProgress();
            progress.setUserId(userId);
            progress.setChallenge(challengeRepository.findById(challengeId).orElse(null));
            progress.setDate(today);
        }
        progress.setClaimed(true);
        progressRepository.save(progress);

        return ResponseEntity.ok(Map.of("correct", correct, "xp", xp));
    }
}
