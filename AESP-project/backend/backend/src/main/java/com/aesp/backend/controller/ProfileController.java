package com.aesp.backend.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.dto.request.DashboardResponse;
import com.aesp.backend.dto.request.ProfileResponseRequest;
import com.aesp.backend.entity.LearnerGoal;
import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.entity.ProfileInterest;
import com.aesp.backend.entity.ServicePackage;
import com.aesp.backend.entity.Topic;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.LearnerGoalRepository;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.ServicePackageRepository;
import com.aesp.backend.repository.TopicRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    @Autowired
    private LearnerGoalRepository goalRepo;

    @Autowired
    private TopicRepository topicRepo;

    @Autowired
    private LearnerProfileRepository profileRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ServicePackageRepository packageRepo;

    @Autowired
    private JwtUtils jwtUtils;

    // =========================================================
    // HELPER
    // =========================================================
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        return userRepo.findByEmail(currentEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentEmail));
    }

    // =========================================================
    // 1. API DANH MỤC (SETUP)
    // =========================================================

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

    // =========================================================
    // 2. API XEM PROFILE
    // =========================================================

    @GetMapping("/me")
    public ResponseEntity<ProfileResponseRequest> getMyProfile() {
        User user = getCurrentUser();

        LearnerProfile profile = profileRepo.findByUser_Id(user.getId())
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
        response.setLearningMode(
                profile.getLearningMode() != null ? profile.getLearningMode().name() : null);
        response.setAssessmentScore(profile.getAssessmentScore());

        if (profile.getMainGoal() != null) {
            response.setMainGoalName(profile.getMainGoal().getGoalName());
        }

        if (profile.getInterests() != null && !profile.getInterests().isEmpty()) {
            response.setInterestNames(
                    profile.getInterests()
                            .stream()
                            .map(i -> i.getTopic().getTopicName())
                            .collect(Collectors.toList()));
        }

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // 3. API SETUP PROFILE
    // =========================================================

    @PostMapping("/setup")
    @Transactional
    public ResponseEntity<?> setupProfile(@RequestBody ProfileResponseRequest request) {
        try {
            User user = getCurrentUser();

            LearnerProfile profile = profileRepo.findByUser(user)
                    .orElse(new LearnerProfile());

            profile.setUser(user);
            profile.setDailyLearningGoalMinutes(request.getDailyTime());

            // Nếu request có assessmentScore > 0 thì cập nhật vào profile
            if (request.getAssessmentScore() != null) {
                profile.setAssessmentScore(request.getAssessmentScore());
                // Chỉ set level khi đã test đầu vào
                if (request.getCurrentLevel() != null) {
                    profile.setCurrentLevelCode(request.getCurrentLevel());
                    if ("A1".equals(request.getCurrentLevel()) || "A2".equals(request.getCurrentLevel())) {
                        profile.setLearningMode(LearnerProfile.LearningMode.FULL_SENTENCE);
                    } else {
                        profile.setLearningMode(LearnerProfile.LearningMode.KEY_PHRASE);
                    }
                }
            }

            if (request.getMainGoalId() != null) {
                goalRepo.findById(request.getMainGoalId())
                        .ifPresent(profile::setMainGoal);
            }

            if (request.getPackageId() != null) {
                packageRepo.findById(request.getPackageId())
                        .ifPresent(profile::setCurrentPackage);
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

            profileRepo.save(profile);
            return ResponseEntity.ok("Thiết lập hồ sơ thành công!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi setup: " + e.getMessage());
        }
    }

    // =========================================================
    // 4. UPDATE PROFILE
    // =========================================================

    @PostMapping("/update-info")
    @Transactional
    public ResponseEntity<?> updatePersonalDetails(@RequestBody ProfileResponseRequest request) {
        User user = getCurrentUser();

        LearnerProfile profile = profileRepo.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Hồ sơ không tồn tại"));

        if (request.getDisplayName() != null)
            profile.setDisplayName(request.getDisplayName());
        if (request.getPhoneNumber() != null)
            profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getAvatarUrl() != null)
            profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getDob() != null)
            profile.setDob(request.getDob());
        if (request.getGender() != null)
            profile.setGender(request.getGender());
        if (request.getOccupation() != null)
            profile.setOccupation(request.getOccupation());

        profileRepo.save(profile);
        return ResponseEntity.ok("Cập nhật thành công!");
    }

    // =========================================================
    // 5. DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtils.getEmailFromToken(token.substring(7));

            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            LearnerProfile profile = profileRepo.findByUser(user).orElse(null);

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

            res.setFullName(
                    profile.getDisplayName() != null && !profile.getDisplayName().isEmpty()
                            ? profile.getDisplayName()
                            : user.getFullName());

            res.setAvatarUrl(profile.getAvatarUrl());
            res.setCurrentLevel(profile.getCurrentLevelCode());

            res.setMainGoal(
                    profile.getMainGoal() != null
                            ? profile.getMainGoal().getGoalName()
                            : "Chưa đặt mục tiêu");

            res.setDailyGoalMinutes(profile.getDailyLearningGoalMinutes());
            res.setLearnedMinutes(0);

            if (profile.getInterests() != null) {
                res.setInterests(
                        profile.getInterests()
                                .stream()
                                .map(i -> i.getTopic().getTopicName())
                                .collect(Collectors.toList()));
            }

            if (profile.getCurrentPackage() != null) {
                res.setPackageName(profile.getCurrentPackage().getPackageName());
                res.setHasMentor(
                        Boolean.TRUE.equals(profile.getCurrentPackage().getHasMentor()));
            } else {
                res.setPackageName("Free Tier");
                res.setHasMentor(false);
            }

            if (profile.getSubscriptionEndDate() != null) {
                long diff = profile.getSubscriptionEndDate().getTime() - new Date().getTime();
                long daysLeft = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
                res.setDaysLeft(Math.max(daysLeft, 0));
            } else {
                res.setDaysLeft(0L);
            }

            return ResponseEntity.ok(res);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi dashboard: " + e.getMessage());
        }
    }

    // =========================================================
    // 6. KIỂM TRA ĐÃ TEST ĐẦU VÀO CHƯA
    // =========================================================
    @GetMapping("/has-tested")
    public ResponseEntity<?> hasTested() {
        User user = getCurrentUser();
        LearnerProfile profile = profileRepo.findByUser_Id(user.getId())
                .orElse(null);
        boolean hasTested = false;
        if (profile != null && profile.getAssessmentScore() != null && profile.getAssessmentScore() > 0) {
            hasTested = true;
        }
        return ResponseEntity.ok(java.util.Collections.singletonMap("hasTested", hasTested));
    }
}
