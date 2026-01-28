package com.aesp.backend.controller;

import com.aesp.backend.dto.response.LeaderboardResponse;
import com.aesp.backend.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin("*") // Cho phép Frontend gọi không bị chặn
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    // API: GET /api/leaderboard
    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>> getLeaderboard() {
        // Lấy Top 5 người xuất sắc nhất
        return ResponseEntity.ok(leaderboardService.getTopLearners(5));
    }
}