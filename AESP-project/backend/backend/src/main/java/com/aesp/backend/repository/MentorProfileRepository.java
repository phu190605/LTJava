package com.aesp.backend.repository;

import com.aesp.backend.entity.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorProfileRepository
        extends JpaRepository<MentorProfile, String> {
}

