package com.aesp.backend.service;

import com.aesp.backend.dto.request.AssessmentSubmitDTO;
import com.aesp.backend.entity.Assessment;
import com.aesp.backend.repository.AssessmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssessmentService {

    private final AssessmentRepository repository;

    public AssessmentService(AssessmentRepository repository) {
        this.repository = repository;
    }

    /* ================== GET PENDING ASSESSMENTS ================== */

    public List<Assessment> getPendingAssessments(String mentorId) {
        return repository.findByMentorIdAndStatus(mentorId, "PENDING");
    }

    /* ================== SUBMIT ASSESSMENT ================== */

    public Assessment submitAssessment(AssessmentSubmitDTO dto) {

        System.out.println("=== SUBMIT ASSESSMENT ===");
        System.out.println("assessmentId = " + dto.getAssessmentId());
        System.out.println("finalLevel = " + dto.getFinalLevel());
        System.out.println("mentorComment = " + dto.getMentorComment());

        Assessment assessment = repository.findById(dto.getAssessmentId())
                .orElseThrow(() ->
                        new RuntimeException("Assessment not found: " + dto.getAssessmentId())
                );

        assessment.setFinalLevel(dto.getFinalLevel());
        assessment.setMentorComment(dto.getMentorComment());
        assessment.setStatus("DONE");

        return repository.save(assessment);
    }
}
