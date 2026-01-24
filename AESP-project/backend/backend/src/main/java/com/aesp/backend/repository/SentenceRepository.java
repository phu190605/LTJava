package com.aesp.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aesp.backend.entity.Sentence;

@Repository
public interface SentenceRepository extends JpaRepository<Sentence, Long> {
    // Lấy ngẫu nhiên 1 câu theo Topic name/code và Level
    @Query(value = "SELECT s.* FROM sentences s " +
                   "JOIN topics t ON s.topic_id = t.topic_id " +
                   "WHERE (t.topic_name = :topic OR t.topic_code = :topic) AND s.level = :level " +
                   "ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Sentence> findRandomSentence(@Param("topic") String topic, 
                                          @Param("level") String level);
}