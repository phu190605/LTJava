package com.aesp.backend.repository;

import com.aesp.backend.entity.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MentorProfileRepository
        extends JpaRepository<MentorProfile, String> {

    Optional<MentorProfile> findByEmail(String email);
}