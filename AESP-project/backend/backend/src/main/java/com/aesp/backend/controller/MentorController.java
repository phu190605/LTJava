package com.aesp.backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.aesp.backend.repository.FeedbackRepository;
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

    public MentorController(
            LearningSessionRepository sessionRepo,
            FeedbackRepository feedbackRepo,
            LearningMaterialRepository materialRepo,
            UserRepository userRepo
    ) {
        this.sessionRepo = sessionRepo;
        this.feedbackRepo = feedbackRepo;
        this.materialRepo = materialRepo;
        this.userRepo = userRepo;
    }

    // ================================
    // 📚 SESSIONS
    // ================================
    @GetMapping("/sessions/{mentorId}")
    public ResponseEntity<List<LearningSession>> getSessions(@PathVariable String mentorId) {
        return ResponseEntity.ok(sessionRepo.findByMentorId(mentorId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<LearningSession> createSession(@RequestBody LearningSession session) {
        if (session.getId() == null) {
            session.setId(UUID.randomUUID().toString());
        }
        return ResponseEntity.ok(sessionRepo.save(session));
    }

    // ================================
    // 📁 MATERIAL UPLOAD
    // ================================
    @PostMapping("/materials")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("mentorId") String mentorId
    ) {
        try {
            Path materialsDir = Paths.get("materials");
            Files.createDirectories(materialsDir);

            String safeFilename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = materialsDir.resolve(safeFilename);
            file.transferTo(path);

            LearningMaterial material = new LearningMaterial();
            material.setMentorId(mentorId);
            material.setTitle(title);
            material.setFileUrl("http://localhost:8080/materials/" + safeFilename);

            String type = file.getContentType() != null ? file.getContentType().toLowerCase() : "";
            material.setType(type.contains("pdf") ? "PDF"
                    : type.contains("audio") ? "AUDIO" : "OTHER");

            materialRepo.save(material);
            return ResponseEntity.ok(material);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload error: " + e.getMessage());
        }
    }

    @GetMapping("/materials")
    public ResponseEntity<List<LearningMaterial>> getAllMaterials() {
        return ResponseEntity.ok(materialRepo.findAll());
    }

    // ================================
    // 📊 DASHBOARD
    // ================================
    @GetMapping("/dashboard/{mentorId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable String mentorId) {
        int pending = (int) sessionRepo.findByMentorId(mentorId)
                .stream().filter(s -> !"DONE".equalsIgnoreCase(s.getStatus())).count();

        int feedbackCount = (int) feedbackRepo.findAll()
                .stream().filter(f -> mentorId.equals(f.getMentorId())).count();

        long studentCount = sessionRepo.findByMentorId(mentorId)
                .stream().map(s -> s.getLearnerId()).distinct().count();

        int materialCount = (int) materialRepo.findAll()
                .stream().filter(m -> mentorId.equals(m.getMentorId())).count();

        return ResponseEntity.ok(
                new com.aesp.backend.repository.DashboardResponse(
                        pending, feedbackCount, (int) studentCount, materialCount
                )
        );
    }

    // ================================
    // 👤 PROFILE
    // ================================
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // đảm bảo FE không crash khi certificates null
        if (u.getCertificates() == null) {
            u.setCertificates("");
        }

        return ResponseEntity.ok(u);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, Object> req
    ) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // Gọi thẳng từ JSON map → không bị lỗi khi field rỗng
        if (req.containsKey("fullName")) {
            u.setFullName((String) req.get("fullName"));
        }

        if (req.containsKey("bio")) {
            u.setBio((String) req.get("bio"));
        }

        if (req.containsKey("avatarUrl")) {
            u.setAvatarUrl((String) req.get("avatarUrl"));
        }

        if (req.containsKey("certificates")) {
            String cert = (String) req.get("certificates");
            u.setCertificates(cert == null ? "" : cert.trim());
        }

        // Ghi xuống DB ngay lập tức
        User saved = userRepo.saveAndFlush(u);
        return ResponseEntity.ok(saved);
    }

    // === Upload Avatar ===
    @PostMapping("/profile/upload-avatar/{id}")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        try {
            Path dir = Paths.get("avatars");
            Files.createDirectories(dir);

            String safeName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = dir.resolve(safeName);
            file.transferTo(path);

            u.setAvatarUrl("http://localhost:8080/avatars/" + safeName);
            userRepo.save(u);

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message", "Avatar uploaded",
                            "avatarUrl", u.getAvatarUrl()
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    // === Upload Certificate ===
    @PostMapping("/profile/upload-certificate/{id}")
    public ResponseEntity<?> uploadCertificate(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        try {
            Path dir = Paths.get("certificates");
            Files.createDirectories(dir);

            String safeName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = dir.resolve(safeName);
            file.transferTo(path);

            String newEntry = "http://localhost:8080/certificates/" + safeName;
            String existing = (u.getCertificates() == null) ? "" : u.getCertificates().trim();

            u.setCertificates(existing.isEmpty() ? newEntry : existing + "," + newEntry);

            userRepo.save(u);

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message", "Certificate uploaded",
                            "certificates", u.getCertificates()
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

}
