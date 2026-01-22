package com.aesp.backend.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aesp.backend.entity.UserChallengeProgress;

@Repository
public interface UserChallengeProgressRepository extends JpaRepository<UserChallengeProgress, Long> {

    // Tìm xem user hôm nay đã làm nhiệm vụ X chưa
    Optional<UserChallengeProgress> findByUserIdAndChallengeIdAndDate(Long userId, Long challengeId, LocalDate date);

    // Lấy tất cả tiến độ thử thách của user trong ngày
    java.util.List<UserChallengeProgress> findByUserIdAndDate(Long userId, LocalDate date);
}
