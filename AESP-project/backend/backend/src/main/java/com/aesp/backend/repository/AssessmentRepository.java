package com.aesp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aesp.backend.entity.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, String> {

    List<Assessment> findByMentorIdAndStatus(String mentorId, String status);
    List<Assessment> findByMentorId(String mentorId);
}
