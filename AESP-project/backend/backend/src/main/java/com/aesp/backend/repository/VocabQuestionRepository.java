package com.aesp.backend.repository;

import com.aesp.backend.entity.VocabQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabQuestionRepository extends JpaRepository<VocabQuestion, Long> {
    // Lấy 5 câu hỏi random theo topic (nếu cần)
    @Query(value = "SELECT * FROM vocab_questions WHERE topic = ?1 ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<VocabQuestion> findRandomByTopic(String topic);

    // Lấy 5 câu hỏi random bất kỳ
    @Query(value = "SELECT * FROM vocab_questions ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<VocabQuestion> findRandomQuestions();
}
