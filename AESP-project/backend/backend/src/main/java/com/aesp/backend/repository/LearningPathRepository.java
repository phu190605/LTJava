package com.aesp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aesp.backend.entity.LearningPath;

public interface LearningPathRepository
        extends JpaRepository<LearningPath, Long> {

    LearningPath findByLearnerId(Long learnerId);
}
