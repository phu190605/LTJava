package com.aesp.backend.service;

import com.aesp.backend.dto.request.SystemPolicyDTO;
import com.aesp.backend.entity.SystemPolicy;
import com.aesp.backend.repository.SystemPolicyRepository;
import org.springframework.stereotype.Service;

@Service
public class SystemPolicyService {

    private final SystemPolicyRepository repository;

    public SystemPolicyService(SystemPolicyRepository repository) {
        this.repository = repository;
    }

    public SystemPolicy createPolicy(SystemPolicyDTO dto) {
        SystemPolicy policy = new SystemPolicy();
        policy.setType(dto.getType());
        policy.setContent(dto.getContent());
        policy.setVersion(dto.getVersion());
        policy.setActive(true);
        return repository.save(policy);
    }

    public SystemPolicy getActivePolicy(String type) {
        return repository.findByTypeAndIsActiveTrue(type)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
    }
}
