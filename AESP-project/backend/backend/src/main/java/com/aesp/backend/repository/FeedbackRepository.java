package com.aesp.backend.repository;

import com.aesp.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository
        extends JpaRepository<Feedback, String> {
    List<Feedback> findBySessionId(String sessionId);
}

