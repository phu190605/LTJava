package com.aesp.backend.repository;

import com.aesp.backend.entity.PathStage;
import com.aesp.backend.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PathStageRepository extends JpaRepository<PathStage, Long> {
    
    // ===== FIND BY LEARNING PATH =====
    List<PathStage> findByLearningPath(LearningPath learningPath);
    
    List<PathStage> findByLearningPathOrderByStageOrder(LearningPath learningPath);
    
    List<PathStage> findByLearningPath_PathId(Long pathId);
    
    // ===== FIND BY STATUS =====
    List<PathStage> findByStageStatus(PathStage.StageStatus status);
}
