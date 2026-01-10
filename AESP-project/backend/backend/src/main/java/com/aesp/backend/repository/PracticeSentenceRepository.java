package com.aesp.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aesp.backend.entity.PracticeSentence;
import com.aesp.backend.entity.ProficiencyLevel;

@Repository
public interface PracticeSentenceRepository extends JpaRepository<PracticeSentence, Long> {
    
    // Find sentences by topic and level
    List<PracticeSentence> findByTopicAndLevel(String topic, ProficiencyLevel level);
    
    // Get random sentence from DB for topic and level
    @Query(value = "SELECT * FROM practice_sentences WHERE topic = :topic AND level = :level ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<PracticeSentence> findRandomByTopicAndLevel(@Param("topic") String topic, @Param("level") String level);
    
    // Get random sentence excluding a specific one (to avoid duplicates)
    @Query(value = "SELECT * FROM practice_sentences WHERE topic = :topic AND level = :level AND sentence != :excludeSentence ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<PracticeSentence> findRandomByTopicAndLevelExcluding(@Param("topic") String topic, @Param("level") String level, @Param("excludeSentence") String excludeSentence);
    
    // Find by topic only
    List<PracticeSentence> findByTopic(String topic);
    
    // Find by level only
    List<PracticeSentence> findByLevel(ProficiencyLevel level);
}
