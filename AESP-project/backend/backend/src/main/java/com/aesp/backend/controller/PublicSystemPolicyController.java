package com.aesp.backend.controller;

import com.aesp.backend.entity.SystemPolicy;
import com.aesp.backend.service.SystemPolicyService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/policies")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicSystemPolicyController {

    private final SystemPolicyService service;

    public PublicSystemPolicyController(SystemPolicyService service) {
        this.service = service;
    }

    // User / Guest xem chính sách đang active
    // GET http://localhost:8080/api/public/policies/{type}
    @GetMapping("/{type}")
    public SystemPolicy getPolicy(@PathVariable String type) {
        return service.getActivePolicy(type);
    }
}
