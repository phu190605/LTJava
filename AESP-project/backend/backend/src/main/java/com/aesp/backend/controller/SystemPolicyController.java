package com.aesp.backend.controller;

import com.aesp.backend.dto.request.SystemPolicyDTO;
import com.aesp.backend.entity.SystemPolicy;
import com.aesp.backend.service.SystemPolicyService;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/auth/policy")
@CrossOrigin(origins = "http://localhost:5173")
public class SystemPolicyController {

    private final SystemPolicyService service;

    public SystemPolicyController(SystemPolicyService service) {
        this.service = service;
    }

    // Admin tạo chính sách - URL Mới: POST http://localhost:8080/api/auth/policies
    @PostMapping
    public SystemPolicy create(@RequestBody SystemPolicyDTO dto) {
        return service.createPolicy(dto);
    }

    // Public lấy chính sách - URL Mới: GET http://localhost:8080/api/auth/policies/{type}
    @GetMapping("/{type}")
    public SystemPolicy getPolicy(@PathVariable String type) {
        return service.getActivePolicy(type);
    }
}
