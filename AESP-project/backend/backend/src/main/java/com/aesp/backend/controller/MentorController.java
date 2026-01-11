package com.aesp.backend.controller;

import com.aesp.backend.dto.request.UpdateMentorProfileDTO;
import com.aesp.backend.entity.MentorProfile;
import com.aesp.backend.service.MentorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private final MentorService service;

    public MentorController(MentorService service) {
        this.service = service;
    }

    /* ================== DASHBOARD ================== */

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            @RequestParam String mentorId
    ) {
        return ResponseEntity.ok(
                service.getDashboard(mentorId)
        );
    }

    /* ================== MATERIALS ================== */

    @GetMapping("/materials")
    public ResponseEntity<?> getMaterials() {
        return ResponseEntity.ok(
                service.getAllMaterials()
        );
    }

    @PostMapping("/materials")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String mentorId,
            @RequestParam String level,
            @RequestParam String category
    ) {
        return ResponseEntity.ok(
                service.uploadMaterial(
                        file, title, mentorId, level, category
                )
        );
    }

    /* ================== PROFILE ================== */

    @GetMapping("/profile/{mentorId}")
    public ResponseEntity<?> getProfile(
            @PathVariable String mentorId
    ) {
        MentorProfile profile = service.getProfile(mentorId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateMentorProfileDTO dto
    ) {
        return ResponseEntity.ok(
                service.updateProfile(dto)
        );
    }
}
