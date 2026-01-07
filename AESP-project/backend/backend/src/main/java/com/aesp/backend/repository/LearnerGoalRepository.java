package com.aesp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aesp.backend.entity.LearnerGoal;

public interface LearnerGoalRepository extends JpaRepository<LearnerGoal, Integer> {
}