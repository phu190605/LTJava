package com.aesp.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;

@Service
@RequiredArgsConstructor
public class LearningPathService {

    private final LearningPathRepository pathRepo;
    private final LearnerProfileRepository profileRepo;

    public LearningPath createLearningPath(Long learnerId, String level) {

        LearnerProfile profile = profileRepo
            .findById(learnerId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));

        LearningPath path = new LearningPath();
        path.setLearnerId(learnerId);
        path.setLevel(level);
        path.setGoal(profile.getGoal());
        path.setIndustry(profile.getIndustry());
        path.setStatus("ACTIVE");

        return pathRepo.save(path);
    }

    public LearningPath getByLearnerId(Long learnerId) {
        return pathRepo.findByLearnerId(learnerId);
    }
}
