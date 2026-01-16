package com.aesp.backend.service;

import com.aesp.backend.entity.LearningSession;
import com.aesp.backend.repository.LearningSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningSessionService {

    private final LearningSessionRepository repo;

    public LearningSessionService(LearningSessionRepository repo) {
        this.repo = repo;
    }

    public List<LearningSession> getSessionsByMentor(String mentorId) {
        return repo.findByMentorId(mentorId);
    }
}
