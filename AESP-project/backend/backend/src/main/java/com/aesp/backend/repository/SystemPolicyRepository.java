package com.aesp.backend.repository;

import com.aesp.backend.entity.SystemPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SystemPolicyRepository extends JpaRepository<SystemPolicy, Long> {

    Optional<SystemPolicy> findByTypeAndIsActiveTrue(String type);
}
