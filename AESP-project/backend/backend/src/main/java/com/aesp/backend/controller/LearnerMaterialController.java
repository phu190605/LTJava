package com.aesp.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.entity.LearningMaterial;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.LearningMaterialRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/learner/materials")
public class LearnerMaterialController {

    private final LearnerProfileRepository profileRepo;
    private final LearningMaterialRepository materialRepo;
    private final UserRepository userRepo;
    private final JwtUtils jwtUtils;

    public LearnerMaterialController(
            LearnerProfileRepository profileRepo,
            LearningMaterialRepository materialRepo,
            UserRepository userRepo,
            JwtUtils jwtUtils
    ) {
        this.profileRepo = profileRepo;
        this.materialRepo = materialRepo;
        this.userRepo = userRepo;
        this.jwtUtils = jwtUtils;
    }

    /**
     * ✅ LẤY TÀI LIỆU CỦA MENTOR ĐANG HỌC
     */
    @GetMapping
public ResponseEntity<List<LearningMaterial>> getMyMentorMaterials(
        @RequestHeader("Authorization") String token
) {
    String email = jwtUtils.getEmailFromToken(token.substring(7));

    User learner = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    LearnerProfile profile = profileRepo.findByUser(learner)
            .orElseThrow(() -> new RuntimeException("Learner profile not found"));

    User mentor = profile.getSelectedMentor();
    if (mentor == null) {
        return ResponseEntity.ok(List.of());
    }

    // ✅ FIX CHUẨN – KHÔNG DÙNG findAll + filter
    List<LearningMaterial> materials =
            materialRepo.findByMentorId(mentor.getId().toString());

    return ResponseEntity.ok(materials);
}

}
