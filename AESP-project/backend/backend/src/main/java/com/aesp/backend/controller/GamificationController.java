package com.aesp.backend.controller;

import com.aesp.backend.entity.UserChallengeProgress;
import com.aesp.backend.entity.UserGamificationStats;
import com.aesp.backend.repository.UserChallengeProgressRepository;
import com.aesp.backend.repository.UserGamificationStatsRepository;
import com.aesp.backend.service.GamificationService; // Import Service
import com.aesp.backend.entity.ChallengeType; // Import Enum

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    @Autowired
    private UserGamificationStatsRepository statsRepository;

    @Autowired
    private UserChallengeProgressRepository progressRepository;

    @Autowired
    private GamificationService gamificationService;

    // 1. API Lấy thông tin Streak & Tổng XP (Cho Luồng 1)
    @GetMapping("/stats/{userId}")
    public ResponseEntity<UserGamificationStats> getUserStats(@PathVariable Long userId) {
        // Luôn cập nhật streak khi lấy stats
        gamificationService.updateStreak(userId);
        // Nếu chưa có thì tự động tạo bản ghi mặc định
        UserGamificationStats stats = statsRepository.findById(userId)
                .orElseGet(() -> {
                    UserGamificationStats newStats = new UserGamificationStats();
                    newStats.setUserId(userId);
                    newStats.setCurrentStreak(1);
                    newStats.setMaxStreak(1);
                    newStats.setTotalXp(0L);
                    newStats.setLastPracticeDate(java.time.LocalDate.now());
                    return statsRepository.save(newStats);
                });
        return ResponseEntity.ok(stats);
    }

    // 2. API Lấy danh sách tiến độ thử thách trong ngày (Cho Luồng 2)
    @GetMapping("/challenges/{userId}")
    public ResponseEntity<List<UserChallengeProgress>> getDailyProgress(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        // Lấy tất cả tiến độ của user trong hôm nay
        // Chuyển đổi kết quả trả về: nếu có trường LocalDate, chuyển sang String ISO
        List<UserChallengeProgress> progressList = progressRepository.findByUserIdAndDate(userId, today);
        // Nếu dùng Jackson mặc định, có thể cần thêm @JsonFormat hoặc custom DTO
        // Nếu vẫn lỗi, nên tạo DTO chuyển LocalDate -> String
        return ResponseEntity.ok(progressList);
    }

    // 3. API Test giả lập nộp bài (Để test UI tăng điểm)
    @PostMapping("/simulate-speaking")
    public ResponseEntity<String> simulateSpeaking(@RequestParam Long userId, @RequestParam int minutes) {
        // Gọi Service đã viết trước đó
        gamificationService.updateStreak(userId);
        gamificationService.processActivity(userId, ChallengeType.SPEAKING_TIME, minutes);
        return ResponseEntity.ok("Đã nộp bài nói " + minutes + " phút!");
    }
}