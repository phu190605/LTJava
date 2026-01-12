package com.aesp.backend.service;

import com.aesp.backend.dto.request.FeedbackRequestDTO;
import com.aesp.backend.entity.Feedback;
import com.aesp.backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    // ===== Submit feedback =====
    public Feedback submitFeedback(FeedbackRequestDTO dto) {
        Feedback fb = new Feedback();
        fb.setSessionId(dto.sessionId);
        fb.setComment(dto.comment);
        fb.setGrammarScore(dto.grammarScore);
        fb.setPronunciationScore(dto.pronunciationScore);

        // ✅ Lưu thời điểm hiện tại
        fb.setTimeStamp(LocalDateTime.now());

        return repo.save(fb);
    }

    // ===== Lấy feedback theo session =====
    public List<Feedback> getFeedback(String sessionId) {
        return repo.findBySessionId(sessionId);
    }

    // ===== Lấy feedback theo mentor (có thể dùng cho Dashboard) =====
    public List<Feedback> getFeedbackByMentor(String mentorId) {
        return repo.findByMentorId(mentorId);
    }
}
