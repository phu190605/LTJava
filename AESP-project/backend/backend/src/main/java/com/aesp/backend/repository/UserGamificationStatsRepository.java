package com.aesp.backend.repository;

import com.aesp.backend.entity.UserGamificationStats;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGamificationStatsRepository extends JpaRepository<UserGamificationStats, Long> {

    // Dùng cho Luồng 4: Lấy Top học viên có XP cao nhất
    // Pageable giúp bạn giới hạn lấy Top 10 hoặc Top 20 dễ dàng
    @Query("SELECT s FROM UserGamificationStats s ORDER BY s.totalXp DESC")
    List<UserGamificationStats> findTopLearners(Pageable pageable);
    
    // Ví dụ cách gọi trong Service:
    // Pageable topTen = PageRequest.of(0, 10);
    // List<UserGamificationStats> leaderboard = repository.findTopLearners(topTen);
}