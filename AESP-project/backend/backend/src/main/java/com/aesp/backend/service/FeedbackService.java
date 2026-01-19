package com.aesp.backend.service;

import com.aesp.backend.entity.Feedback;
import com.aesp.backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    public List<Feedback> getByExercise(String exerciseId) {
        return repo.findByExerciseId(exerciseId);
    }
}
