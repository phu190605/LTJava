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
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MentorService {

    private final LearningSessionRepository sessionRepo;
    private final FeedbackRepository feedbackRepo;
    private final LearningMaterialRepository materialRepo;
    private final MentorProfileRepository profileRepo;
    private final UserRepository userRepo;

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

        // Lấy tất cả session của mentor
        List<LearningSession> sessions = sessionRepo.findByMentorId(mentorId);

        // ======= To-do list =======
        long pendingFeedbacks = sessions.stream()
                .filter(s -> "WAITING".equals(s.getStatus()))
                .count();

        long pendingAssessments = 0; // Nếu bạn có module Assessment, cập nhật ở đây

        Map<String, Object> todo = new HashMap<>();
        todo.put("pendingFeedbacks", pendingFeedbacks);
        todo.put("pendingAssessments", pendingAssessments);

        // ======= Statistics =======
        long activeLearners = sessions.stream()
                .map(LearningSession::getLearnerId)
                .distinct()
                .count();

        long totalSessions = sessions.size();

        // Feedbacks this week (dùng thời gian hiện tại)
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        long feedbacksThisWeek = feedbackRepo.findByMentorId(mentorId).stream()
                .filter(f -> f.getTimeStamp() != null && f.getTimeStamp().isAfter(oneWeekAgo))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeLearners", activeLearners);
        stats.put("sessionsThisWeek", totalSessions); // nếu muốn chính xác tuần, cần thêm createdAt
        stats.put("feedbacksThisWeek", feedbacksThisWeek);

        // ======= Schedule (placeholder) =======
        List<Map<String, Object>> schedule = new ArrayList<>();
        // Sau này tích hợp booking/appointment, thêm object {time, learner, topic}

        // ======= Kết hợp tất cả =======
        Map<String, Object> res = new HashMap<>();
        res.put("todo", todo);
        res.put("stats", stats);
        res.put("schedule", schedule);

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
        fb.setTimeStamp(LocalDateTime.now());

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
            m.setType(
                    file.getContentType() != null &&
                    file.getContentType().contains("pdf")
                            ? "PDF"
                            : "OTHER"
            );

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

        if (dto == null || dto.mentorId == null || dto.mentorId.isEmpty()) {
            throw new RuntimeException("mentorId không hợp lệ");
        }

        // mentorId phải tồn tại trong bảng users
        Long mentorUserId;
        try {
            mentorUserId = Long.parseLong(dto.mentorId);
        } catch (NumberFormatException e) {
            throw new RuntimeException("mentorId phải là số");
        }

        User mentor = userRepo.findById(mentorUserId)
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
        profile.setSkills(dto.skills == null ? new ArrayList<>() : dto.skills);
        profile.setCertificates(dto.certificates == null ? new ArrayList<>() : dto.certificates);

        return profileRepo.save(profile);
    }
}
