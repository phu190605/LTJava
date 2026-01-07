package com.aesp.backend.controller;

import com.aesp.backend.dto.request.ProfileResponseRequest;
import com.aesp.backend.dto.request.DashboardResponse;
import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;
import com.aesp.backend.security.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

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
    private UserRepository userRepository;
    @Autowired
    private LearnerProfileRepository profileRepository;
    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Helper: Lấy User đang đăng nhập từ SecurityContext (Email nạp từ JWT)
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        return userRepo.findByEmail(currentEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentEmail));
    }

    // =========================================================================
    // 1. CÁC API LẤY DỮ LIỆU DANH MỤC (PHỤC VỤ TRANG SETUP)
    // =========================================================================

    @GetMapping("/goals")
    public ResponseEntity<List<LearnerGoal>> getAllGoals() {
        return ResponseEntity.ok(goalRepo.findAll()); // Lấy "thật" từ bảng learner_goals
    }

    @GetMapping("/topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicRepo.findAll()); // Lấy "thật" từ bảng topics
    }

    @GetMapping("/packages")
    public ResponseEntity<List<ServicePackage>> getAllPackages() {
        return ResponseEntity.ok(packageRepo.findAll()); // Lấy "thật" từ bảng service_packages
    }

    // =========================================================================
    // 2. API XEM HỒ SƠ CÁ NHÂN (DASHBOARD)
    // =========================================================================

    @GetMapping("/me")
    public ResponseEntity<ProfileResponseRequest> getMyProfile() {
        User user = getCurrentUser();
        LearnerProfile profile = profileRepo.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Hồ sơ chưa được thiết lập"));

        ProfileResponseRequest response = new ProfileResponseRequest();

        // Mapping dữ liệu từ User
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());

        // Mapping dữ liệu từ LearnerProfile
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

        // Join dữ liệu thật từ bảng liên kết
        if (profile.getMainGoal() != null) {
            response.setMainGoalName(profile.getMainGoal().getGoalName());
        }

        if (profile.getInterests() != null && !profile.getInterests().isEmpty()) {
            List<String> names = profile.getInterests().stream()
                    .map(i -> i.getTopic().getTopicName())
                    .collect(Collectors.toList()); // Sửa lỗi tolist -> toList
            response.setInterestNames(names);
        }

        return ResponseEntity.ok(response);
    }

    // =========================================================================
    // 3. API SETUP LỘ TRÌNH (ONBOARDING)
    // =========================================================================

    @PostMapping("/setup")
    @Transactional
    public ResponseEntity<?> setupProfile(@RequestBody ProfileResponseRequest request) {
        try {
            User user = getCurrentUser();
            // Tìm profile theo User object thay vì ID để an toàn hơn
            LearnerProfile profile = profileRepo.findByUser(user).orElse(new LearnerProfile());

            profile.setUser(user);
            profile.setCurrentLevelCode(request.getCurrentLevel());
            profile.setDailyLearningGoalMinutes(request.getDailyTime());

            // Logic Adaptive: Tự động gán chế độ học
            if ("A1".equals(request.getCurrentLevel()) || "A2".equals(request.getCurrentLevel())) {
                profile.setLearningMode(LearnerProfile.LearningMode.FULL_SENTENCE);
            } else {
                profile.setLearningMode(LearnerProfile.LearningMode.KEY_PHRASE);
            }

            // Gán các thực thể từ Database
            if (request.getMainGoalId() != null) {
                goalRepo.findById(request.getMainGoalId()).ifPresent(profile::setMainGoal);
            }
            if (request.getPackageId() != null) {
                packageRepo.findById(request.getPackageId()).ifPresent(profile::setCurrentPackage);
            }

            // Update Interests (Sửa lỗi orphan removal bằng cách tạo list mới nếu null)
            if (request.getInterestTopicIds() != null) {
                if (profile.getInterests() == null) {
                    profile.setInterests(new ArrayList<>());
                } else {
                    profile.getInterests().clear(); // Hibernate sẽ tự delete nếu cấu hình đúng
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
            e.printStackTrace(); // In lỗi ra console để dễ debug
            return ResponseEntity.badRequest().body("Lỗi setup: " + e.getMessage());
        }
    }

    // =========================================================================
    // 4. API CẬP NHẬT THÔNG TIN CÁ NHÂN (SETTINGS)
    // =========================================================================

    @PutMapping("/update-info")
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

    // === API MỚI CHO DASHBOARD ===
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(@RequestHeader("Authorization") String token) {
        try {
            // 1. Lấy Email từ Token (Cắt bỏ chữ "Bearer ")
            String email = jwtUtils.getEmailFromToken(token.substring(7));

            // 2. Tìm User
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            // 3. Tìm Profile dựa trên User
            LearnerProfile profile = profileRepo.findByUser(user).orElse(null);

            // 4. Map dữ liệu sang DTO Response
            DashboardResponse res = new DashboardResponse();

            // -- Nhóm thông tin cơ bản --
            // --- TRƯỜNG HỢP 1: CHƯA CÓ PROFILE (Vẫn trả về tên User) ---
            if (profile == null) {
                res.setFullName(user.getFullName()); // Lấy tên từ bảng User
                res.setAvatarUrl(null); // Hoặc link ảnh mặc định
                res.setCurrentLevel("Chưa kiểm tra");
                res.setMainGoal("Chưa thiết lập");
                res.setDailyGoalMinutes(0);
                res.setLearnedMinutes(0);
                res.setInterests(new ArrayList<>());
                res.setPackageName("Free Tier");
                res.setHasMentor(false);
                res.setDaysLeft(0L);

                return ResponseEntity.ok(res); // Trả về data "rỗng" nhưng có tên User
            }

            // --- TRƯỜNG HỢP 2: ĐÃ CÓ PROFILE (Mapping như cũ) ---
            res.setFullName(profile.getDisplayName() != null && !profile.getDisplayName().isEmpty()
                    ? profile.getDisplayName()
                    : user.getFullName());
            res.setAvatarUrl(profile.getAvatarUrl());
            res.setCurrentLevel(profile.getCurrentLevelCode());

            // -- Nhóm Mục tiêu --
            if (profile.getMainGoal() != null) {
                res.setMainGoal(profile.getMainGoal().getGoalName());
            } else {
                res.setMainGoal("Chưa đặt mục tiêu");
            }
            res.setDailyGoalMinutes(profile.getDailyLearningGoalMinutes());
            res.setLearnedMinutes(0); // Tạm thời để 0, sau này làm tính năng học sẽ update

            // -- Nhóm Sở thích (Interests) --
            // Dùng Stream API để lấy list tên Topic từ list ProfileInterest
            List<String> topicNames = new ArrayList<>();
            if (profile.getInterests() != null) {
                topicNames = profile.getInterests().stream()
                        .map(interest -> interest.getTopic().getTopicName())
                        .collect(Collectors.toList());
            }
            res.setInterests(topicNames);

            // -- Nhóm Subscription (QUAN TRỌNG CHO TASK CỦA BẠN) --
            if (profile.getCurrentPackage() != null) {
                res.setPackageName(profile.getCurrentPackage().getPackageName());
                res.setHasMentor(
                        profile.getCurrentPackage().getHasMentor() != null ? profile.getCurrentPackage().getHasMentor()
                                : false);
            } else {
                res.setPackageName("Free Tier");
                res.setHasMentor(false);
            }

            // Tính số ngày còn lại
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