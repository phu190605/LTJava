package com.aesp.backend.repository;

import com.aesp.backend.entity.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {
    List<TestQuestion> findByLevel(String level);
}
