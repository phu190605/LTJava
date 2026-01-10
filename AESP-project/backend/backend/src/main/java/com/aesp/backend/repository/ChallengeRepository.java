package com.aesp.backend.repository;

import com.aesp.backend.entity.Challenge;
import com.aesp.backend.entity.ChallengeType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByType(ChallengeType type);
}
