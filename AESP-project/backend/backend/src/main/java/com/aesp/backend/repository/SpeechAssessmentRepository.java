package com.aesp.backend.repository;

import com.aesp.backend.entity.SpeechAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeechAssessmentRepository extends JpaRepository<SpeechAssessment, Long> {
    
    List<SpeechAssessment> findByUserIdOrderByCreatedAtDesc(Long userId);
}