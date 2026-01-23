package com.aesp.backend.controller;

import com.aesp.backend.dto.request.SystemPolicyDTO;
import com.aesp.backend.entity.SystemPolicy;
import com.aesp.backend.service.SystemPolicyService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/policies")
public class AdminSystemPolicyController {

    private final SystemPolicyService service;

    public AdminSystemPolicyController(SystemPolicyService service) {
        this.service = service;
    }

    /**
     * ADMIN tạo / cập nhật policy
     * POST http://localhost:8080/api/admin/policies
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SystemPolicy createOrUpdatePolicy(@RequestBody SystemPolicyDTO dto) {
        return service.createPolicy(dto);
    }

    /**
     * ADMIN xem policy đang active theo type
     * GET http://localhost:8080/api/admin/policies/{type}
     */
    @GetMapping("/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    public SystemPolicy getPolicyByType(@PathVariable String type) {
        return service.getActivePolicy(type);
    }
}
