package com.aesp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aesp.backend.entity.LearnerProfile;

public interface LearnerProfileRepository
        extends JpaRepository<LearnerProfile, Long> {
}
