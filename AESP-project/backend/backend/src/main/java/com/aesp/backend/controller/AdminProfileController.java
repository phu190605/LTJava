package com.aesp.backend.controller;

import com.aesp.backend.dto.request.respone.AdminProfileResponse;
import com.aesp.backend.dto.request.UpdateAdminProfileRequest;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProfileController {

    private final UserRepository userRepository;

    public AdminProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public AdminProfileResponse getProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow();

        return new AdminProfileResponse(
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole()
        );
    }

    @PutMapping
    public void updateProfile(@RequestBody UpdateAdminProfileRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        admin.setFullName(request.getFullName());
        userRepository.save(admin);
    }
}

