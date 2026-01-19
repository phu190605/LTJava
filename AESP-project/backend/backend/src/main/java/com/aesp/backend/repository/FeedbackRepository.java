package com.aesp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aesp.backend.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, String> {

    // Lấy feedback theo exercise
    List<Feedback> findByExerciseId(String exerciseId);

    // Lấy feedback theo mentor
    List<Feedback> findByMentorId(String mentorId);
}
