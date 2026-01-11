package com.aesp.backend.repository;

import com.aesp.backend.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository
        extends JpaRepository<Assessment, String> {

    List<Assessment> findByMentorIdAndStatus(
            String mentorId,
            String status
    );
}