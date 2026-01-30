package com.aesp.backend.repository;

import com.aesp.backend.entity.VocabQuestionAttempt;
import com.aesp.backend.entity.UserLearningPath;
import com.aesp.backend.entity.LearningPathVocabQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VocabQuestionAttemptRepository extends JpaRepository<VocabQuestionAttempt, Long> {
    
    // Find all attempts for an enrollment
    List<VocabQuestionAttempt> findByEnrollment(UserLearningPath enrollment);
    
    // Find specific attempt by enrollment and question
    Optional<VocabQuestionAttempt> findByEnrollmentAndQuestion(UserLearningPath enrollment, LearningPathVocabQuestion question);
    
    // Find all attempts by enrollment ID
    List<VocabQuestionAttempt> findByEnrollment_Id(Long enrollmentId);
    
    // Calculate average score for an enrollment
    double getAverageScoreByEnrollment(UserLearningPath enrollment);
    
    // Count completed questions (score >= 70)
    long countByEnrollmentAndScoreGreaterThanEqual(UserLearningPath enrollment, Integer minScore);
}
