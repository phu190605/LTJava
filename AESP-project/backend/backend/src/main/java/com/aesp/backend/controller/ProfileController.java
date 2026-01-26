package com.aesp.backend.controller;

import com.aesp.backend.dto.response.DashboardResponse;
import com.aesp.backend.dto.request.ProfileResponseRequest;
import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;
import com.aesp.backend.security.JwtUtils;
import com.aesp.backend.service.SpeakingResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    @Autowired
    private LearnerGoalRepository goalRepo;
    @Autowired
    private TopicRepository topicRepo;
    @Autowired
    private ServicePackageRepository packageRepo;
    @Autowired
    private LearnerProfileRepository profileRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private SpeakingResultService speakingResultService;
    @Autowired
    private SpeechAssessmentRepository speechAssessmentRepo;

    /**
     * Lấy User hiện tại một cách an toàn
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("Chưa đăng nhập");
        }
        
        Object principal = authentication.getPrincipal();
        
        // Nếu Principal là đối tượng User (do JwtAuthenticationFilter nạp vào)
        if (principal instanceof User) {
            return (User) principal;
        }
        
        // Nếu Principal chỉ là String email (phương án dự phòng)
        String currentEmail = authentication.getName();
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentEmail));
    }

    private ProficiencyLevel mapLevelCodeToEnum(String levelCode) {
        if (levelCode == null) return null;
        return switch (levelCode.toUpperCase()) {
            case "A1", "A2" -> ProficiencyLevel.BEGINNER;
            case "B1" -> ProficiencyLevel.INTERMEDIATE;
            case "B2" -> ProficiencyLevel.ADVANCED;
            default -> null;
        };
    }

    @GetMapping("/goals")
    public ResponseEntity<List<LearnerGoal>> getAllGoals() {
        return ResponseEntity.ok(goalRepo.findAll());
    }

    @GetMapping("/topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicRepo.findAll());
    }

    @GetMapping("/packages")
    public ResponseEntity<List<ServicePackage>> getAllPackages() {
        return ResponseEntity.ok(packageRepo.findAll());
    }

    @PostMapping("/setup")
    @Transactional
    public ResponseEntity<?> setupProfile(@RequestBody ProfileResponseRequest request) {
        try {
            User user = getCurrentUser();
            
            // Tìm profile theo ID của user để đảm bảo tính nhất quán
            LearnerProfile profile = profileRepository.findByUser_Id(user.getId())
                                    .orElse(new LearnerProfile());

            profile.setUser(user);
            profile.setCurrentLevelCode(request.getCurrentLevel());
            profile.setProficiencyLevel(mapLevelCodeToEnum(request.getCurrentLevel()));
            profile.setDailyLearningGoalMinutes(request.getDailyTime());
            profile.setSetupComplete(true); 

            // Thiết lập chế độ học dựa trên trình độ
            if ("A1".equals(request.getCurrentLevel()) || "A2".equals(request.getCurrentLevel())) {
                profile.setLearningMode(LearnerProfile.LearningMode.FULL_SENTENCE);
            } else {
                profile.setLearningMode(LearnerProfile.LearningMode.KEY_PHRASE);
            }

            // Gán mục tiêu
            if (request.getMainGoalId() != null) {
                goalRepo.findById(request.getMainGoalId()).ifPresent(profile::setMainGoal);
            }
            
            // Gán gói dịch vụ
            if (request.getPackageId() != null) {
                packageRepo.findById(request.getPackageId()).ifPresent(profile::setCurrentPackage);
            }

            // Xử lý sở thích
            if (request.getInterestTopicIds() != null) {
                if (profile.getInterests() == null) {
                    profile.setInterests(new ArrayList<>());
                } else {
                    profile.getInterests().clear();
                }

                for (Integer topicId : request.getInterestTopicIds()) {
                    topicRepo.findById(topicId.longValue()).ifPresent(topic -> {
                        ProfileInterest pi = new ProfileInterest();
                        pi.setProfile(profile);
                        pi.setTopic(topic);
                        profile.getInterests().add(pi);
                    });
                }
            }

            profileRepository.save(profile);

            // Lưu điểm số kiểm tra nói ban đầu (nếu có)
            if (request.getAssessmentScore() != null) {
                SpeakingResult result = new SpeakingResult();
                result.setUserId(user.getId());
                result.setPartNumber(1);
                result.setScore(request.getAssessmentScore().intValue());
                result.setFeedback("Initial speaking test");
                result.setCreatedAt(LocalDateTime.now());
                speakingResultService.saveSpeakingResult(result);
            }

            return ResponseEntity.ok("Thiết lập hồ sơ thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi setup: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponseRequest> getMyProfile() {
        User user = getCurrentUser();
        LearnerProfile profile = profileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Hồ sơ chưa được thiết lập"));

        ProfileResponseRequest response = new ProfileResponseRequest();
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setDisplayName(profile.getDisplayName());
        response.setAvatarUrl(profile.getAvatarUrl());
        response.setPhoneNumber(profile.getPhoneNumber());
        response.setDob(profile.getDob());
        response.setGender(profile.getGender());
        response.setOccupation(profile.getOccupation());
        response.setCurrentLevel(profile.getCurrentLevelCode());
        response.setDailyTime(profile.getDailyLearningGoalMinutes());
        response.setLearningMode(profile.getLearningMode() != null ? profile.getLearningMode().name() : null);
        response.setAssessmentScore(profile.getAssessmentScore());

        if (profile.getMainGoal() != null) {
            response.setMainGoalName(profile.getMainGoal().getGoalName());
        }

        if (profile.getInterests() != null && !profile.getInterests().isEmpty()) {
            List<String> names = profile.getInterests().stream()
                    .map(i -> i.getTopic().getTopicName())
                    .collect(Collectors.toList());
            response.setInterestNames(names);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(@RequestHeader("Authorization") String token) {
        try {
            User user = getCurrentUser();
            LearnerProfile profile = profileRepository.findByUser_Id(user.getId()).orElse(null);
            DashboardResponse res = new DashboardResponse();

            if (profile == null) {
                res.setFullName(user.getFullName());
                res.setCurrentLevel("Chưa kiểm tra");
                res.setMainGoal("Chưa thiết lập");
                return ResponseEntity.ok(res);
            }

            res.setFullName(profile.getDisplayName() != null && !profile.getDisplayName().isEmpty() 
                ? profile.getDisplayName() : user.getFullName());
            res.setAvatarUrl(profile.getAvatarUrl());
            res.setCurrentLevel(profile.getCurrentLevelCode());
            res.setDailyGoalMinutes(profile.getDailyLearningGoalMinutes());

            List<SpeechAssessment> assessments = speechAssessmentRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
            
            // Heatmap
            Map<String, Integer> heatMapData = assessments.stream()
                .collect(Collectors.groupingBy(
                    a -> a.getCreatedAt().toLocalDate().toString(),
                    Collectors.summingInt(a -> 1)
                ));
            res.setHeatMapData(heatMapData);

            // Trends
            List<SpeechAssessment> trendData = new ArrayList<>(assessments);
            Collections.reverse(trendData);

            res.setPronunciationScores(trendData.stream().map(SpeechAssessment::getAccuracyScore).collect(Collectors.toList()));
            res.setFluencyScores(trendData.stream().map(SpeechAssessment::getFluencyScore).collect(Collectors.toList()));
            res.setTrendLabels(trendData.stream().map(a -> a.getCreatedAt().toLocalDate().toString()).collect(Collectors.toList()));
            
            int totalWords = assessments.stream()
                .mapToInt(a -> a.getWordDetails() != null ? a.getWordDetails().size() : 0).sum();
            res.setTotalWordsLearned(totalWords);

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi Dashboard: " + e.getMessage());
        }
    }
}