package com.aesp.backend.controller;

import com.aesp.backend.entity.Feedback;
import com.aesp.backend.entity.LearningMaterial;
import com.aesp.backend.entity.LearningSession;
import com.aesp.backend.repository.LearningSessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.aesp.backend.repository.FeedbackRepository;
import com.aesp.backend.repository.LearningMaterialRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private final LearningSessionRepository sessionRepo;
    private final FeedbackRepository feedbackRepo;
    private final LearningMaterialRepository materialRepo;

    public MentorController(LearningSessionRepository sessionRepo,
                            FeedbackRepository feedbackRepo,
                            LearningMaterialRepository materialRepo) {
        this.sessionRepo = sessionRepo;
        this.feedbackRepo = feedbackRepo;
        this.materialRepo = materialRepo;
    }

    // --- Sessions ---
    @GetMapping("/sessions/{mentorId}")
    public ResponseEntity<List<LearningSession>> getSessions(@PathVariable String mentorId) {
        return ResponseEntity.ok(sessionRepo.findByMentorId(mentorId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<LearningSession> createSession(@RequestBody LearningSession session) {
        if (session.getId() == null) session.setId(UUID.randomUUID().toString());
        return ResponseEntity.ok(sessionRepo.save(session));
    }

    // --- Feedback ---
    @PostMapping("/feedback")
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback fb) {
        LearningSession session = sessionRepo.findById(fb.getSessionId()).orElseThrow();
        fb.setMentorId(session.getMentorId());
        fb.setLearnerId(session.getLearnerId());
        return ResponseEntity.ok(feedbackRepo.save(fb));
    }

    @GetMapping("/feedback/{sessionId}")
    public ResponseEntity<List<Feedback>> getFeedback(@PathVariable String sessionId) {
        return ResponseEntity.ok(feedbackRepo.findBySessionId(sessionId));
    }

    // --- Learning Materials ---
@PostMapping("/materials")
public ResponseEntity<?> uploadMaterial(
        @RequestParam(value = "file", required = true) MultipartFile file,
        @RequestParam(value = "title", required = true) String title,
        @RequestParam(value = "mentorId", required = true) String mentorId) {

    // Kiểm tra input
    if (file == null || file.isEmpty()) {
        return ResponseEntity.badRequest().body("File không được để trống");
    }
    if (title == null || title.isEmpty()) {
        return ResponseEntity.badRequest().body("Title không được để trống");
    }
    if (mentorId == null || mentorId.isEmpty()) {
        return ResponseEntity.badRequest().body("mentorId không hợp lệ");
    }

    try {
        // Tạo thư mục lưu file nếu chưa tồn tại
        java.nio.file.Path materialsDir = java.nio.file.Paths.get("materials");
        java.nio.file.Files.createDirectories(materialsDir);

        // Tạo tên file hợp lệ
        String originalFilename = file.getOriginalFilename();
        String safeFilename = UUID.randomUUID() + "_" + (originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_") : "file");
        java.nio.file.Path path = materialsDir.resolve(safeFilename);

        // Lưu file lên ổ cứng
        file.transferTo(path);

        // Tạo đối tượng LearningMaterial
        LearningMaterial material = new LearningMaterial();
        material.setMentorId(mentorId);
        material.setTitle(title);
        material.setFileUrl("http://localhost:8080/materials/" + safeFilename);
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";
        if (contentType.contains("pdf")) {
            material.setType("PDF");
        } else if (contentType.contains("audio")) {
            material.setType("AUDIO");
        } else {
            material.setType("OTHER");
        }

        // Lưu vào database
        materialRepo.save(material);

        return ResponseEntity.ok(material);

    } catch (Exception e) {
        e.printStackTrace(); // log lỗi
        return ResponseEntity.status(500).body("Lỗi khi upload file: " + e.getMessage());
    }
}

    @GetMapping("/materials")
    public ResponseEntity<List<LearningMaterial>> getAllMaterials() {
        return ResponseEntity.ok(materialRepo.findAll());
    }
}

