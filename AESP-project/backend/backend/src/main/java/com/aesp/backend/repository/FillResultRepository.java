package com.aesp.backend.repository;

import com.aesp.backend.entity.FillResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FillResultRepository extends JpaRepository<FillResult, Long> {
    List<FillResult> findAllByUserIdOrderByPartNumberAsc(Long userId);
}
