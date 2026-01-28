package com.aesp.backend.controller;

import com.aesp.backend.dto.request.AssessmentSubmitDTO;
import com.aesp.backend.entity.SpeakingResult;
import com.aesp.backend.repository.SpeakingResultRepository;
import com.aesp.backend.service.SpeakingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping({ "/api/mentor/assessments", "/api/mentor/assessment" })
public class AssessmentController {

    private final SpeakingResultRepository speakingRepo;
    private final SpeakingService speakingService;

    public AssessmentController(SpeakingResultRepository speakingRepo,
            SpeakingService speakingService) {
        this.speakingRepo = speakingRepo;
        this.speakingService = speakingService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SpeakingResult>> getPendingAssessments() {
        List<SpeakingResult> list = speakingRepo.findAll();
        return ResponseEntity.ok(list);
    }
    @GetMapping("/{assessmentId}")
    public ResponseEntity<?> getAssessmentDetail(@PathVariable Long assessmentId) {
        SpeakingResult result = speakingRepo.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Speaking result not found"));

        Map<String, Object> res = new HashMap<>();
        res.put("id", result.getId());
        res.put("userId", result.getUserId());
        res.put("audioUrl", result.getFeedback());
        res.put("score", result.getScore());
        res.put("feedback", result.getFeedback());

        return ResponseEntity.ok(res);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAssessment(@Valid @RequestBody AssessmentSubmitDTO dto) {

        SpeakingResult result = speakingRepo.findById(Long.parseLong(dto.getAssessmentId()))
                .orElseThrow(() -> new RuntimeException("Speaking result not found"));

        String finalLevel = dto.getFinalLevel() != null
                ? dto.getFinalLevel()
                : speakingService.evaluateLevel(result.getScore());

        result.setFeedback(
                result.getFeedback()
                        + "\n[Mentor Comment]: " + dto.getMentorComment()
                        + "\n[Final Level]: " + finalLevel);

        speakingRepo.save(result);

        return ResponseEntity.ok(result);
    }
}
