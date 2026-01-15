package com.aesp.backend.controller;

import com.aesp.backend.dto.request.DashboardResponse;
import com.aesp.backend.dto.request.ProfileResponseRequest;
import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;
import com.aesp.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.aesp.backend.entity.SpeakingResult;
import com.aesp.backend.service.SpeakingResultService;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
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

    private ProficiencyLevel mapLevelCodeToEnum(String levelCode) {
        if (levelCode == null) return null;
        if ("A1".equalsIgnoreCase(levelCode) || "A2".equalsIgnoreCase(levelCode)) {
            return ProficiencyLevel.BEGINNER;
        } else if ("B1".equalsIgnoreCase(levelCode)) {
            return ProficiencyLevel.INTERMEDIATE;
        } else if ("B2".equalsIgnoreCase(levelCode)) {
            return ProficiencyLevel.ADVANCED;
        }
        return null;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentEmail));
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

    // =========================================================================
    // API SETUP LỘ TRÌNH (FIXED: Added isSetupComplete = true)
    // =========================================================================
    @PostMapping("/setup")
    @Transactional
    public ResponseEntity<?> setupProfile(@RequestBody ProfileResponseRequest request) {
        try {
            User user = getCurrentUser();
            LearnerProfile profile = profileRepository.findByUser(user).orElse(new LearnerProfile());

            profile.setUser(user);
            profile.setCurrentLevelCode(request.getCurrentLevel());
            profile.setProficiencyLevel(mapLevelCodeToEnum(request.getCurrentLevel()));
            profile.setDailyLearningGoalMinutes(request.getDailyTime());

            // 1. QUAN TRỌNG: Đánh dấu đã setup thành công để lưu 1 vào DB
            profile.setSetupComplete(true); 

            // Logic Adaptive: Tự động gán chế độ học
            if ("A1".equals(request.getCurrentLevel()) || "A2".equals(request.getCurrentLevel())) {
                profile.setLearningMode(LearnerProfile.LearningMode.FULL_SENTENCE);
            } else {
                profile.setLearningMode(LearnerProfile.LearningMode.KEY_PHRASE);
            }

            if (request.getMainGoalId() != null) {
                goalRepo.findById(request.getMainGoalId()).ifPresent(profile::setMainGoal);
            }
            if (request.getPackageId() != null) {
                packageRepo.findById(request.getPackageId()).ifPresent(profile::setCurrentPackage);
            }

            if (request.getInterestTopicIds() != null) {
                if (profile.getInterests() == null) {
                    profile.setInterests(new ArrayList<>());
                } else {
                    profile.getInterests().clear();
                }

                for (Integer topicId : request.getInterestTopicIds()) {
                    topicRepo.findById(topicId).ifPresent(topic -> {
                        ProfileInterest pi = new ProfileInterest();
                        pi.setProfile(profile);
                        pi.setTopic(topic);
                        profile.getInterests().add(pi);
                    });
                }
            }

            // 2. Lưu lại bản ghi đã có setSetupComplete(true)
            profileRepository.save(profile);

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

    @PutMapping("/update-info")
    @Transactional
    public ResponseEntity<?> updatePersonalDetails(@RequestBody ProfileResponseRequest request) {
        User user = getCurrentUser();
        LearnerProfile profile = profileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Hồ sơ không tồn tại"));

        if (request.getDisplayName() != null) profile.setDisplayName(request.getDisplayName());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getDob() != null) profile.setDob(request.getDob());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getOccupation() != null) profile.setOccupation(request.getOccupation());

        profileRepository.save(profile);
        return ResponseEntity.ok("Cập nhật thành công!");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtils.getEmailFromToken(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            LearnerProfile profile = profileRepository.findByUser(user).orElse(null);
            DashboardResponse res = new DashboardResponse();

            if (profile == null) {
                res.setFullName(user.getFullName());
                res.setCurrentLevel("Chưa kiểm tra");
                res.setMainGoal("Chưa thiết lập");
                res.setDailyGoalMinutes(0);
                res.setLearnedMinutes(0);
                res.setInterests(new ArrayList<>());
                res.setPackageName("Free Tier");
                res.setHasMentor(false);
                res.setDaysLeft(0L);
                return ResponseEntity.ok(res);
            }

            res.setFullName(profile.getDisplayName() != null && !profile.getDisplayName().isEmpty()
                    ? profile.getDisplayName() : user.getFullName());
            res.setAvatarUrl(profile.getAvatarUrl());
            res.setCurrentLevel(profile.getCurrentLevelCode());

            if (profile.getMainGoal() != null) {
                res.setMainGoal(profile.getMainGoal().getGoalName());
            } else {
                res.setMainGoal("Chưa đặt mục tiêu");
            }
            res.setDailyGoalMinutes(profile.getDailyLearningGoalMinutes());
            res.setLearnedMinutes(0);

            List<String> topicNames = new ArrayList<>();
            if (profile.getInterests() != null) {
                topicNames = profile.getInterests().stream()
                        .map(interest -> interest.getTopic().getTopicName())
                        .collect(Collectors.toList());
            }
            res.setInterests(topicNames);

            if (profile.getCurrentPackage() != null) {
                res.setPackageName(profile.getCurrentPackage().getPackageName());
                res.setHasMentor(profile.getCurrentPackage().getHasMentor() != null 
                        ? profile.getCurrentPackage().getHasMentor() : false);
            } else {
                res.setPackageName("Free Tier");
                res.setHasMentor(false);
            }

            if (profile.getSubscriptionEndDate() != null) {
                long diffInMillies = profile.getSubscriptionEndDate().getTime() - new Date().getTime();
                long daysLeft = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
                res.setDaysLeft(daysLeft > 0 ? daysLeft : 0);
            } else {
                res.setDaysLeft(0L);
            }

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy dữ liệu Dashboard: " + e.getMessage());
        }
    }
}