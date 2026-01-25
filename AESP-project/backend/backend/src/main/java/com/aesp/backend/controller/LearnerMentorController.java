package com.aesp.backend.controller;
import com.aesp.backend.dto.response.PlacementResultDTO;
import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learner/mentor")
public class LearnerMentorController {

        private final LearnerProfileRepository profileRepo;
        private final UserRepository userRepo;
        private final JwtUtils jwtUtils;

        public LearnerMentorController(
                        LearnerProfileRepository profileRepo,
                        UserRepository userRepo,
                        JwtUtils jwtUtils) {
                this.profileRepo = profileRepo;
                this.userRepo = userRepo;
                this.jwtUtils = jwtUtils;
        }

        /* ===== CHỌN MENTOR ===== */
        @PostMapping("/select/{mentorId}")
        public ResponseEntity<?> selectMentor(
                        @RequestHeader("Authorization") String token,
                        @PathVariable Long mentorId) {
                String email = jwtUtils.getEmailFromToken(token.substring(7));

                User learner = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                LearnerProfile profile = profileRepo.findByUser(learner)
                                .orElseThrow(() -> new RuntimeException("Learner profile not found"));

                User mentor = userRepo.findById(mentorId)
                                .orElseThrow(() -> new RuntimeException("Mentor not found"));

                if (!"MENTOR".equals(mentor.getRole())) {
                        return ResponseEntity.badRequest().body("User không phải mentor");
                }

                profile.setSelectedMentor(mentor);
                profileRepo.save(profile);

                return ResponseEntity.ok("Đã chọn mentor thành công");
        }

        /* ===== CLEAR MENTOR ===== */
        @DeleteMapping("/clear")
        public ResponseEntity<?> clearMentor(
                        @RequestHeader("Authorization") String token) {
                String email = jwtUtils.getEmailFromToken(token.substring(7));

                User learner = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                LearnerProfile profile = profileRepo.findByUser(learner)
                                .orElseThrow(() -> new RuntimeException("Learner profile not found"));

                profile.setSelectedMentor(null);
                profileRepo.save(profile);

                return ResponseEntity.ok("Đã hủy mentor");
        }

        /* ===== LẤY MENTOR ĐÃ CHỌN ===== */
        @GetMapping("/selected")
        public ResponseEntity<?> getSelectedMentor(
                        @RequestHeader("Authorization") String token) {
                String email = jwtUtils.getEmailFromToken(token.substring(7));

                User learner = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                LearnerProfile profile = profileRepo.findByUser(learner)
                                .orElseThrow(() -> new RuntimeException("Learner profile not found"));

                return ResponseEntity.ok(profile.getSelectedMentor());
        }
        /* ===== LẤY KẾT QUẢ KIỂM TRA ĐẦU VÀO & NHẬN XÉT ===== */
       @GetMapping("/placement-result")
public ResponseEntity<?> getPlacementResult(@RequestHeader("Authorization") String token) {
    String email = jwtUtils.getEmailFromToken(token.substring(7));
    User learner = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    LearnerProfile profile = profileRepo.findByUser(learner)
            .orElseThrow(() -> new RuntimeException("Learner profile not found"));

    PlacementResultDTO dto = new PlacementResultDTO();
    // Giả sử levelBefore là assessmentScore (level lúc test đầu vào), levelAfter là currentLevelCode (level sau khi mentor đánh giá)
    dto.setLevelBefore(profile.getAssessmentScore() != null ? profile.getAssessmentScore().toString() : null);
    dto.setLevelAfter(profile.getCurrentLevelCode());
    dto.setMentorNote(profile.getMentorNote());
    return ResponseEntity.ok(dto);
}

}
