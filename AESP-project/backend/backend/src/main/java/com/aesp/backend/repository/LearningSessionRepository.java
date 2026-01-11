package com.aesp.backend.repository;

import com.aesp.backend.entity.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningSessionRepository
        extends JpaRepository<LearningSession, String> {
    List<LearningSession> findByMentorId(String mentorId);
}
