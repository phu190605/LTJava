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
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.LearningMaterialRepository;
import com.aesp.backend.repository.LearningSessionRepository;
import com.aesp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/mentor")
@CrossOrigin(origins = "*")
public class MentorController {

    private final LearningSessionRepository sessionRepo;
    private final LearningMaterialRepository materialRepo;
    private final UserRepository userRepo;
    private final LearnerProfileRepository learnerProfileRepo;

    public MentorController(
            LearningSessionRepository sessionRepo,
            LearningMaterialRepository materialRepo,
            UserRepository userRepo,
            LearnerProfileRepository learnerProfileRepo 
    ) {
        this.sessionRepo = sessionRepo;
        this.materialRepo = materialRepo;
        this.userRepo = userRepo;
        this.learnerProfileRepo = learnerProfileRepo;
    }

    private User getCurrentMentor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        String email = auth.getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
    }


    @GetMapping("/sessions")
    public ResponseEntity<List<LearningSession>> getSessions() {
        String mentorId = getCurrentMentor().getId().toString();
        return ResponseEntity.ok(sessionRepo.findByMentorId(mentorId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<LearningSession> createSession(
            @RequestBody LearningSession session) {
        if (session.getId() == null) {
            session.setId(UUID.randomUUID().toString());
        }
        session.setMentorId(getCurrentMentor().getId().toString());
        return ResponseEntity.ok(sessionRepo.save(session));
    }

    @PostMapping("/materials")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title) {
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
                        .toList());
    }


    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        User mentor = getCurrentMentor();
        String mentorId = mentor.getId().toString();

        int pending = (int) sessionRepo.findByMentorId(mentorId)
                .stream()
                .filter(s -> !"DONE".equalsIgnoreCase(s.getStatus()))
                .count();

        int feedback = 0; 

        int students = (int) learnerProfileRepo.countBySelectedMentor(mentor);

        int materials = (int) materialRepo.findAll()
                .stream()
                .filter(m -> mentorId.equals(m.getMentorId()))
                .count();

        return ResponseEntity.ok(
                new DashboardResponse(pending, feedback, students, materials));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User u = getCurrentMentor();
        if (u.getCertificates() == null)
            u.setCertificates("");
        return ResponseEntity.ok(u);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> req) {
        User u = getCurrentMentor();

        if (req.containsKey("fullName"))
            u.setFullName((String) req.get("fullName"));
        if (req.containsKey("bio"))
            u.setBio((String) req.get("bio"));
        if (req.containsKey("avatarUrl"))
            u.setAvatarUrl((String) req.get("avatarUrl"));
        if (req.containsKey("certificates")) {
            String c = (String) req.get("certificates");
            u.setCertificates(c == null ? "" : c.trim());
        }

        return ResponseEntity.ok(userRepo.saveAndFlush(u));
    }


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

    @GetMapping("/placement-results")
    public ResponseEntity<?> getPlacementResults() {
        var testedLearners = learnerProfileRepo.findAll()
                .stream()
                .filter(p -> p.getAssessmentScore() != null)
                .filter(p -> p.getCurrentPackage() != null && Boolean.TRUE.equals(p.getCurrentPackage().getHasMentor()))
                .toList();
        System.out.println("Tested learners: " + testedLearners.size());
        testedLearners.forEach(l -> System.out.println(l.getUser() != null ? l.getUser().getFullName() : "null user"));
        return ResponseEntity.ok(testedLearners);
    }

    // 2. Mentor đánh giá/xếp lớp cho learner
    @PostMapping("/placement-evaluate")
    public ResponseEntity<?> evaluatePlacement(
            @RequestParam Long learnerId,
            @RequestParam String newLevel,
            @RequestParam(required = false) String mentorNote) {
        var profile = learnerProfileRepo.findByUser_Id(learnerId)
                .orElseThrow(() -> new RuntimeException("Learner not found"));
        profile.setCurrentLevelCode(newLevel);
        if (mentorNote != null) {
            profile.setMentorNote(mentorNote); // Thêm field mentorNote vào entity nếu muốn lưu nhận xét
        }
        learnerProfileRepo.save(profile);
        return ResponseEntity.ok("Đã cập nhật xếp lớp cho học viên.");
    }
}
