package com.aesp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aesp.backend.entity.AssessmentResult;

public interface AssessmentResultRepository
        extends JpaRepository<AssessmentResult, Long> {
}
