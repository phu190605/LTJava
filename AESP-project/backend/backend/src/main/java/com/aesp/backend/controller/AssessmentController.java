package com.aesp.backend.controller;

import com.aesp.backend.dto.request.AssessmentSubmitDTO;
import com.aesp.backend.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentor/assessments")
public class AssessmentController {

    private final AssessmentService service;

    public AssessmentController(AssessmentService service) {
        this.service = service;
    }

    /* ================== LIST ASSESSMENTS ================== */

    @GetMapping
    public ResponseEntity<?> getPendingAssessments(@RequestParam String mentorId) {
        return ResponseEntity.ok(service.getPendingAssessments(mentorId));
    }

    /* ================== SUBMIT ASSESSMENT ================== */

    @PostMapping("/submit")
    public ResponseEntity<?> submitAssessment(@Valid @RequestBody AssessmentSubmitDTO dto) {
        return ResponseEntity.ok(service.submitAssessment(dto));
    }
}
