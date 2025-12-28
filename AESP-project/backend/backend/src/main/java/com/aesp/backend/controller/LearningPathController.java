package com.aesp.backend.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.aesp.backend.entity.AssessmentResult;
import com.aesp.backend.entity.LearningPath;
import com.aesp.backend.service.*;

@RestController
@RequestMapping("/api/learning-path")
@RequiredArgsConstructor
public class LearningPathController {

    private final AssessmentService assessmentService;
    private final LearningPathService learningPathService;

    @PostMapping("/assessment")
    public LearningPath submitAssessment(
        @RequestBody AssessmentResult request
    ) {
        AssessmentResult saved =
            assessmentService.evaluateAndSave(request);

        return learningPathService.createLearningPath(
            saved.getLearnerId(),
            saved.getOverallLevel()
        );
    }

    @GetMapping("/{learnerId}")
    public LearningPath getLearningPath(
        @PathVariable Long learnerId
    ) {
        return learningPathService.getByLearnerId(learnerId);
    }
}
