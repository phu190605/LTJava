package com.aesp.backend.service;

import com.aesp.backend.dto.request.FeedbackRequestDTO;
import com.aesp.backend.entity.Feedback;
import com.aesp.backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    public Feedback submitFeedback(FeedbackRequestDTO dto) {
        Feedback fb = new Feedback();
        fb.setSessionId(dto.sessionId);
        fb.setComment(dto.comment);
        fb.setGrammarScore(dto.grammarScore);
        fb.setPronunciationScore(dto.pronunciationScore);
        fb.setTimeStamp(dto.timeStamp);
        return repo.save(fb);
    }

    public List<Feedback> getFeedback(String sessionId) {
        return repo.findBySessionId(sessionId);
    }
}
