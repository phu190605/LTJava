package com.aesp.backend.service;

import com.aesp.backend.dto.request.FeedbackRequestDTO;
import com.aesp.backend.dto.request.UpdateMentorProfileDTO;
import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class MentorService {

    private final LearningSessionRepository sessionRepo;
    private final FeedbackRepository feedbackRepo;
    private final LearningMaterialRepository materialRepo;
    private final MentorProfileRepository profileRepo;
    private final UserRepository userRepo; // ✅ FIX: thêm userRepo

    // ✅ FIX: inject userRepo
    public MentorService(
            LearningSessionRepository sessionRepo,
            FeedbackRepository feedbackRepo,
            LearningMaterialRepository materialRepo,
            MentorProfileRepository profileRepo,
            UserRepository userRepo
    ) {
        this.sessionRepo = sessionRepo;
        this.feedbackRepo = feedbackRepo;
        this.materialRepo = materialRepo;
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }

    /* ================= DASHBOARD ================= */

    public Map<String, Object> getDashboard(String mentorId) {

        long pendingFeedbacks = sessionRepo
                .findByMentorId(mentorId)
                .stream()
                .filter(s -> "WAITING".equals(s.getStatus()))
                .count();

        long totalSessions = sessionRepo.findByMentorId(mentorId).size();

        Map<String, Object> res = new HashMap<>();
        res.put("pendingAssessments", 0); // assessment làm sau
        res.put("pendingFeedbacks", pendingFeedbacks);
        res.put("activeLearners", totalSessions);
        res.put("sessionsThisWeek", totalSessions);

        return res;
    }

    /* ================= FEEDBACK ================= */

    public Feedback submitFeedback(FeedbackRequestDTO dto) {

        LearningSession session = sessionRepo
                .findById(dto.sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        Feedback fb = new Feedback();
        fb.setSessionId(dto.sessionId);
        fb.setMentorId(session.getMentorId());
        fb.setLearnerId(session.getLearnerId());
        fb.setComment(dto.comment);
        fb.setGrammarScore(dto.grammarScore);
        fb.setPronunciationScore(dto.pronunciationScore);
        fb.setTimeStamp(dto.timeStamp);

        return feedbackRepo.save(fb);
    }

    public List<Feedback> getFeedback(String sessionId) {
        return feedbackRepo.findBySessionId(sessionId);
    }

    /* ================= MATERIALS ================= */

    public List<LearningMaterial> getAllMaterials() {
        return materialRepo.findAll();
    }

    public LearningMaterial uploadMaterial(
            MultipartFile file,
            String title,
            String mentorId,
            String level,
            String category
    ) {
        try {
            Path dir = Paths.get("materials");
            Files.createDirectories(dir);

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = dir.resolve(filename);
            file.transferTo(path);

            LearningMaterial m = new LearningMaterial();
            m.setMentorId(mentorId);
            m.setTitle(title);
            m.setFileUrl("http://localhost:8080/materials/" + filename);
            m.setType(file.getContentType().contains("pdf") ? "PDF" : "OTHER");

            return materialRepo.save(m);

        } catch (Exception e) {
            throw new RuntimeException("Upload failed", e);
        }
    }

    /* ================= PROFILE ================= */

    public MentorProfile getProfile(String mentorId) {
        return profileRepo.findById(mentorId).orElse(null);
    }

    public MentorProfile updateProfile(UpdateMentorProfileDTO dto) {

        if (dto.mentorId == null) {
            throw new RuntimeException("mentorId không được null");
        }

        // ✅ FIX QUAN TRỌNG: mentorId PHẢI tồn tại trong bảng user
        User mentor = userRepo.findById(Long.valueOf(dto.mentorId))
                .orElseThrow(() -> new RuntimeException("Mentor user không tồn tại"));

        MentorProfile profile = profileRepo
                .findById(dto.mentorId)
                .orElseGet(() -> {
                    MentorProfile p = new MentorProfile();
                    p.setId(dto.mentorId);
                    p.setEmail(mentor.getEmail());
                    return p;
                });

        profile.setFullName(dto.fullName);
        profile.setBio(dto.bio);
        profile.setSkills(dto.skills);
        profile.setCertificates(dto.certificates);

        return profileRepo.save(profile);
    }
}
