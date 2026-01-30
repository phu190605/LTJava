package com.aesp.backend.repository;

import com.aesp.backend.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {
    
    // ===== FIND BY LEVEL =====
    List<LearningPath> findByLevel(String level);
    
    // ===== FIND BY GOAL CODE =====
    List<LearningPath> findByGoalCode(String goalCode);
    
    // ===== FIND BY TOPIC CODE =====
    List<LearningPath> findByTopicCode(String topicCode);
    
    // ===== FIND BY LEVEL AND GOAL CODE =====
    List<LearningPath> findByLevelAndGoalCode(String level, String goalCode);
    
    // ===== FIND BY LEVEL, GOAL CODE AND TOPIC CODE =====
    Optional<LearningPath> findByLevelAndGoalCodeAndTopicCode(String level, String goalCode, String topicCode);
}
