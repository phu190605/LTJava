package com.aesp.backend.repository;

import com.aesp.backend.entity.SpeakingResult;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpeakingResultRepository extends JpaRepository<SpeakingResult, Long> {
    Optional<SpeakingResult> findByUserIdAndPartNumber(Long userId, int partNumber);

    List<SpeakingResult> findAllByUserIdOrderByPartNumberAsc(Long userId);
}
