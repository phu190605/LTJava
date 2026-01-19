package com.aesp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aesp.backend.entity.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise, String> {
    List<Exercise> findByMentorIdAndStatus(String mentorId, String status);
    List<Exercise> findByMentorId(String mentorId);
}
