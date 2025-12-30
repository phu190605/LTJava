package com.aesp.backend.controller;

import com.aesp.backend.dto.request.ProfileSetupRequest;
import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    @Autowired private LearnerGoalRepository goalRepo;
    @Autowired private TopicRepository topicRepo;
    @Autowired private LearnerProfileRepository profileRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ServicePackageRepository packageRepo;

    // Lấy User đang đăng nhập từ Token
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName(); 
        return userRepo.findByEmail(currentEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentEmail));
    }

    // 1. API lấy danh sách Mục tiêu
    @GetMapping("/goals")
    public ResponseEntity<List<LearnerGoal>> getAllGoals() {
        return ResponseEntity.ok(goalRepo.findAll());
    }

    // 2. API lấy danh sách Chủ đề
    @GetMapping("/topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicRepo.findAll());
    }

    // 3. API Xem hồ sơ (Dùng để hiển thị thông tin ở Dashboard)
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        User user = getCurrentUser();
        return profileRepo.findByUser_Id(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. API SETUP: Bỏ qua thông tin cá nhân, chỉ lưu lộ trình học tập
    @PostMapping("/setup")
    public ResponseEntity<?> setupProfile(@RequestBody ProfileSetupRequest request) {
        try {
            User user = getCurrentUser();

            // Tìm profile cũ hoặc tạo mới
            LearnerProfile profile = profileRepo.findByUser_Id(user.getId())
                    .orElse(new LearnerProfile());
            
            profile.setUser(user);

            // Lưu trình độ và thời gian học
            profile.setCurrentLevelCode(request.getCurrentLevel());
            profile.setDailyLearningGoalMinutes(request.getDailyTime());

            // Tự động gán chế độ học dựa trên trình độ
            if ("A1".equals(request.getCurrentLevel()) || "A2".equals(request.getCurrentLevel())) {
                profile.setLearningMode(LearnerProfile.LearningMode.FULL_SENTENCE);
            } else {
                profile.setLearningMode(LearnerProfile.LearningMode.KEY_PHRASE);
            }

            // Lưu Mục tiêu chính
            if (request.getMainGoalId() != null) {
                LearnerGoal goal = goalRepo.findById(request.getMainGoalId()).orElse(null);
                profile.setMainGoal(goal);
            }

            // Lưu Gói dịch vụ
            if (request.getPackageId() != null) {
                ServicePackage pkg = packageRepo.findById(request.getPackageId()).orElse(null);
                profile.setCurrentPackage(pkg);
            }

            // Lưu Sở thích (Topics) - Xử lý logic tránh trùng lặp
            if (request.getInterestTopicIds() != null) {
                Set<Integer> uniqueTopicIds = new HashSet<>(request.getInterestTopicIds());
                
                if (profile.getInterests() == null) {
                    profile.setInterests(new ArrayList<>());
                } else {
                    profile.getInterests().clear(); // Xóa cũ để cập nhật mới theo đúng luồng setup
                }
                
                for (Integer topicId : uniqueTopicIds) {
                    Topic topic = topicRepo.findById(topicId).orElse(null);
                    if (topic != null) {
                        ProfileInterest newInterest = new ProfileInterest();
                        newInterest.setProfile(profile);
                        newInterest.setTopic(topic);
                        profile.getInterests().add(newInterest);
                    }
                }
            }

            profileRepo.save(profile);
            return ResponseEntity.ok("Thiết lập lộ trình thành công!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 5. API Cập nhật thông tin cá nhân (Sẽ dùng ở Dashboard sau này)
    @PutMapping("/update-info")
    public ResponseEntity<?> updatePersonalDetails(@RequestBody ProfileSetupRequest request) {
        User user = getCurrentUser();
        if (request.getDisplayName() != null) user.setFullName(request.getDisplayName());
        // Có thể bổ sung cập nhật SĐT hoặc Avatar tại đây
        userRepo.save(user);
        return ResponseEntity.ok("Cập nhật thông tin thành công!");
    }
}