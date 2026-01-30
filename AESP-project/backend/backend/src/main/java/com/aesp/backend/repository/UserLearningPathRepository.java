package com.aesp.backend.repository;

import com.aesp.backend.entity.User;
import com.aesp.backend.entity.UserLearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLearningPathRepository extends JpaRepository<UserLearningPath, Long> {

    /**
     * Lấy tất cả learning paths của user
     */
    List<UserLearningPath> findByUser(User user);

    /**
     * Lấy learning paths của user theo status
     */
    List<UserLearningPath> findByUserAndStatus(User user, String status);

    /**
     * Kiểm tra xem user đã có learning path này chưa
     */
    Optional<UserLearningPath> findByUserAndLearningPath_PathId(User user, Long pathId);

    /**
     * Lấy learning paths của user theo level
     */
    List<UserLearningPath> findByUserAndLearningPath_Level(User user, String level);
}
