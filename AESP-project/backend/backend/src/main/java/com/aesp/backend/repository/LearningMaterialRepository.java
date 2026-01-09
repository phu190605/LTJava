package com.aesp.backend.repository;

import com.aesp.backend.entity.LearningMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningMaterialRepository extends JpaRepository<LearningMaterial, String> {
}