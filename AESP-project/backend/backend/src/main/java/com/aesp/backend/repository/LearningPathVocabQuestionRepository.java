package com.aesp.backend.repository;

import com.aesp.backend.entity.LearningPathVocabQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPathVocabQuestionRepository extends JpaRepository<LearningPathVocabQuestion, Long> {
    
    // ===== FIND BY LEVEL, GOAL CODE, TOPIC CODE =====
    List<LearningPathVocabQuestion> findByLevelAndGoalCodeAndTopicCode(String level, String goalCode, String topicCode);
    
    // ===== FIND BY LEVEL =====
    List<LearningPathVocabQuestion> findByLevel(String level);
    
    // ===== FIND BY GOAL CODE =====
    List<LearningPathVocabQuestion> findByGoalCode(String goalCode);
    
    // ===== FIND BY TOPIC CODE =====
    List<LearningPathVocabQuestion> findByTopicCode(String topicCode);
}
