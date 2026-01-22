package com.aesp.backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aesp.backend.entity.LearningMaterial;
import com.aesp.backend.entity.LearningSession;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.DashboardResponse;
import com.aesp.backend.repository.FeedbackRepository;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.LearningMaterialRepository;
import com.aesp.backend.repository.LearningSessionRepository;
import com.aesp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/mentor")
@CrossOrigin(origins = "*")
public class MentorController {

    private final LearningSessionRepository sessionRepo;
    private final FeedbackRepository feedbackRepo;
    private final LearningMaterialRepository materialRepo;
    private final UserRepository userRepo;
    private final LearnerProfileRepository learnerProfileRepo; // ✅ THÊM

    public MentorController(
            LearningSessionRepository sessionRepo,
            FeedbackRepository feedbackRepo,
            LearningMaterialRepository materialRepo,
            UserRepository userRepo,
            LearnerProfileRepository learnerProfileRepo // ✅ THÊM
    ) {
        this.sessionRepo = sessionRepo;
        this.feedbackRepo = feedbackRepo;
        this.materialRepo = materialRepo;
        this.userRepo = userRepo;
        this.learnerProfileRepo = learnerProfileRepo;
    }

    // ======================================================
    // 🔐 HELPER: LẤY MENTOR TỪ JWT
    // ======================================================
    private User getCurrentMentor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        String email = auth.getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
    }

    // ================================
    // 📚 SESSIONS
    // ================================
    @GetMapping("/sessions")
    public ResponseEntity<List<LearningSession>> getSessions() {
        String mentorId = getCurrentMentor().getId().toString();
        return ResponseEntity.ok(sessionRepo.findByMentorId(mentorId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<LearningSession> createSession(
            @RequestBody LearningSession session
    ) {
        if (session.getId() == null) {
            session.setId(UUID.randomUUID().toString());
        }
        session.setMentorId(getCurrentMentor().getId().toString());
        return ResponseEntity.ok(sessionRepo.save(session));
    }

    // ================================
    // 📁 MATERIALS
    // ================================
    @PostMapping("/materials")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title
    ) {
        try {
            User mentor = getCurrentMentor();

            Path dir = Paths.get("materials");
            Files.createDirectories(dir);

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            file.transferTo(dir.resolve(filename));

            LearningMaterial m = new LearningMaterial();
            m.setMentorId(mentor.getId().toString());
            m.setTitle(title);
            m.setFileUrl("http://localhost:8080/materials/" + filename);

            String type = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
            m.setType(type.contains("pdf") ? "PDF"
                    : type.contains("audio") ? "AUDIO"
                    : "OTHER");

            return ResponseEntity.ok(materialRepo.save(m));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Upload error: " + e.getMessage());
        }
    }

    @GetMapping("/materials")
    public ResponseEntity<List<LearningMaterial>> getAllMaterials() {
        String mentorId = getCurrentMentor().getId().toString();
        return ResponseEntity.ok(
                materialRepo.findAll()
                        .stream()
                        .filter(m -> mentorId.equals(m.getMentorId()))
                        .toList()
        );
    }

    // ================================
    // DASHBOARD 
    // ================================
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        User mentor = getCurrentMentor();
        String mentorId = mentor.getId().toString();

        int pending = (int) sessionRepo.findByMentorId(mentorId)
                .stream()
                .filter(s -> !"DONE".equalsIgnoreCase(s.getStatus()))
                .count();

        int feedback = feedbackRepo.findByMentorId(mentorId).size();

        //learner đã CHỌN mentor
        int students = (int) learnerProfileRepo.countBySelectedMentor(mentor);

        int materials = (int) materialRepo.findAll()
                .stream()
                .filter(m -> mentorId.equals(m.getMentorId()))
                .count();

        return ResponseEntity.ok(
                new DashboardResponse(pending, feedback, students, materials)
        );
    }

    // ================================
    // 👤 PROFILE
    // ================================
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User u = getCurrentMentor();
        if (u.getCertificates() == null) u.setCertificates("");
        return ResponseEntity.ok(u);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> req) {
        User u = getCurrentMentor();

        if (req.containsKey("fullName")) u.setFullName((String) req.get("fullName"));
        if (req.containsKey("bio")) u.setBio((String) req.get("bio"));
        if (req.containsKey("avatarUrl")) u.setAvatarUrl((String) req.get("avatarUrl"));
        if (req.containsKey("certificates")) {
            String c = (String) req.get("certificates");
            u.setCertificates(c == null ? "" : c.trim());
        }

        return ResponseEntity.ok(userRepo.saveAndFlush(u));
    }

    // ================================
    // 🖼 AVATAR
    // ================================
    @PostMapping("/profile/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            User u = getCurrentMentor();

            Path dir = Paths.get("avatars");
            Files.createDirectories(dir);

            String name = UUID.randomUUID() + "_" + file.getOriginalFilename();
            file.transferTo(dir.resolve(name));

            u.setAvatarUrl("http://localhost:8080/avatars/" + name);
            userRepo.save(u);

            return ResponseEntity.ok(Map.of("avatarUrl", u.getAvatarUrl()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // ================================
    // 📜 CERTIFICATE
    // ================================
    @PostMapping("/profile/upload-certificate")
    public ResponseEntity<?> uploadCert(@RequestParam("file") MultipartFile file) {
        try {
            User u = getCurrentMentor();

            Path dir = Paths.get("certificates");
            Files.createDirectories(dir);

            String name = UUID.randomUUID() + "_" + file.getOriginalFilename();
            file.transferTo(dir.resolve(name));

            String url = "http://localhost:8080/certificates/" + name;
            String old = u.getCertificates() == null ? "" : u.getCertificates();

            u.setCertificates(old.isEmpty() ? url : old + "," + url);
            userRepo.save(u);

            return ResponseEntity.ok(Map.of("certificates", u.getCertificates()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
