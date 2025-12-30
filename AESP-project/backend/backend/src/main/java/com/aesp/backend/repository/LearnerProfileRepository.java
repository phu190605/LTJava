package com.aesp.backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aesp.backend.entity.LearnerProfile;

public interface LearnerProfileRepository extends JpaRepository<LearnerProfile, Long> {
    Optional<LearnerProfile> findByUser_Id(Long userId);
}