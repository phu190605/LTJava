package com.aesp.backend.controller;

import com.aesp.backend.dto.response.ChallengeDTO;
import com.aesp.backend.entity.Challenge;
import com.aesp.backend.repository.ChallengeRepository;
import com.aesp.backend.repository.UserChallengeProgressRepository;
import com.aesp.backend.entity.UserChallengeProgress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/challenge")
public class ChallengeController {
    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private UserChallengeProgressRepository progressRepository;

    @GetMapping
    public List<ChallengeDTO> getAllChallenges(@org.springframework.web.bind.annotation.RequestParam Long userId) {
        // Lấy ngày hiện tại
        java.time.LocalDate today = java.time.LocalDate.now();
        // Lấy tất cả challenge
        List<Challenge> all = challengeRepository.findAll();
        // Lấy tất cả progress của user hôm nay
        java.util.List<UserChallengeProgress> progresses = progressRepository.findByUserIdAndDate(userId, today);
        java.util.Set<Long> completedIds = progresses.stream()
            .filter(UserChallengeProgress::isClaimed)
            .map(p -> p.getChallenge().getId())
            .collect(java.util.stream.Collectors.toSet());
        // Map sang DTO
        return all.stream()
            .map(ch -> new ChallengeDTO(ch, completedIds.contains(ch.getId())))
            .toList();
    }
}
