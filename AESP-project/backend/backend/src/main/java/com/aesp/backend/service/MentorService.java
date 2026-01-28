package com.aesp.backend.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aesp.backend.dto.request.UpdateMentorProfileDTO;
import com.aesp.backend.entity.LearningMaterial;
import com.aesp.backend.entity.LearningSession;
import com.aesp.backend.entity.MentorProfile;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.LearningMaterialRepository;
import com.aesp.backend.repository.LearningSessionRepository;
import com.aesp.backend.repository.MentorProfileRepository;
import com.aesp.backend.repository.UserRepository;

@Service
public class MentorService {

    private final LearningSessionRepository sessionRepo;
    private final LearningMaterialRepository materialRepo;
    private final MentorProfileRepository profileRepo;
    private final UserRepository userRepo;

    public MentorService(
            LearningSessionRepository sessionRepo,
            LearningMaterialRepository materialRepo,
            MentorProfileRepository profileRepo,
            UserRepository userRepo
    ) {
        this.sessionRepo = sessionRepo;
        this.materialRepo = materialRepo;
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }


    public Map<String, Object> getDashboard(String mentorId) {

        List<LearningSession> sessions = sessionRepo.findByMentorId(mentorId);

        long pendingFeedbacks = sessions.stream()
                .filter(s -> "WAITING".equals(s.getStatus()))
                .count();

        Map<String, Object> todo = new HashMap<>();
        todo.put("pendingFeedbacks", pendingFeedbacks);
        todo.put("pendingAssessments", 0);

        long activeLearners = sessions.stream()
                .map(LearningSession::getLearnerId)
                .distinct()
                .count();



        Map<String, Object> stats = new HashMap<>();
        stats.put("activeLearners", activeLearners);
        stats.put("sessionsThisWeek", sessions.size());

        Map<String, Object> res = new HashMap<>();
        res.put("todo", todo);
        res.put("stats", stats);
        res.put("schedule", new ArrayList<>());

        return res;
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
                    file.getContentType() != null && file.getContentType().contains("pdf")
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
