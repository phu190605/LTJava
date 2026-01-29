package com.aesp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aesp.backend.entity.LearningMaterial;

public interface LearningMaterialRepository
        extends JpaRepository<LearningMaterial, String> {
    List<LearningMaterial> findByMentorId(String mentorId);
}
