package com.aesp.backend.controller;

import com.aesp.backend.dto.request.SystemPolicyDTO;
import com.aesp.backend.entity.SystemPolicy;
import com.aesp.backend.service.SystemPolicyService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/policies")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminSystemPolicyController {

    private final SystemPolicyService service;

    public AdminSystemPolicyController(SystemPolicyService service) {
        this.service = service;
    }

    // Admin tạo hoặc cập nhật chính sách
    // POST http://localhost:8080/api/admin/policies
    @PostMapping
    public SystemPolicy createOrUpdatePolicy(@RequestBody SystemPolicyDTO dto) {
        return service.createPolicy(dto);
    }

    // (Optional) Admin xem policy theo type
    // GET http://localhost:8080/api/admin/policies/{type}
    @GetMapping("/{type}")
    public SystemPolicy getPolicyByType(@PathVariable String type) {
        return service.getActivePolicy(type);
    }
}
