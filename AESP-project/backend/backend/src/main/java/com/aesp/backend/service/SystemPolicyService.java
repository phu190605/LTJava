package com.aesp.backend.service;

import com.aesp.backend.dto.request.SystemPolicyDTO;
import com.aesp.backend.entity.SystemPolicy;
import com.aesp.backend.repository.SystemPolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemPolicyService {

    private final SystemPolicyRepository repository;

    public SystemPolicyService(SystemPolicyRepository repository) {
        this.repository = repository;
    }

    /**
     * ADMIN tạo / cập nhật policy
     * - Mỗi type (TERMS / PRIVACY) chỉ có 1 active
     * - Policy cũ bị deactivate
     */
    @Transactional
    public SystemPolicy createPolicy(SystemPolicyDTO dto) {

        repository.findByTypeAndIsActiveTrue(dto.getType())
                .ifPresent(old -> old.setActive(false)); // JPA auto update

        SystemPolicy policy = new SystemPolicy();
        policy.setType(dto.getType());
        policy.setContent(dto.getContent());
        policy.setVersion(
                dto.getVersion() != null
                        ? dto.getVersion()
                        : "v" + System.currentTimeMillis()
        );
        policy.setActive(true);

        return repository.save(policy);
    }

    /**
     * PUBLIC – user / guest xem policy active
     */
    public SystemPolicy getActivePolicy(String type) {
        return repository.findByTypeAndIsActiveTrue(type)
                .orElseThrow(() ->
                        new RuntimeException("Active policy not found: " + type)
                );
    }
}
