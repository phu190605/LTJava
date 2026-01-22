package com.aesp.backend.controller;

import com.aesp.backend.service.GamificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private GamificationService gamificationService;

    // Giả sử đây là API khi User hoàn thành một bài luyện nói
    @PostMapping("/submit")
    public ResponseEntity<String> submitLesson(@RequestParam Long userId) {
        
        // ... (Code chấm điểm, lưu bài làm của bạn ở đây) ...
        // saveLessonResult(userId, ...);

        // KÍCH HOẠT LUỒNG 1: Cập nhật Streak ngay sau khi nộp bài
        gamificationService.updateStreak(userId);

        return ResponseEntity.ok("Bài học đã được nộp và Streak đã được cập nhật!");
    }
}