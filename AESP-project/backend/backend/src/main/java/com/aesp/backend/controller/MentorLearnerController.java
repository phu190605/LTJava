package com.aesp.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.entity.User;
import com.aesp.backend.repository.ExerciseRepository;
import com.aesp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/mentor")
@CrossOrigin(origins = "http://localhost:5173")
public class MentorLearnerController {

    private final UserRepository userRepo;
    private final ExerciseRepository exerciseRepo;

    public MentorLearnerController(UserRepository userRepo, ExerciseRepository exerciseRepo) {
        this.userRepo = userRepo;
        this.exerciseRepo = exerciseRepo;
    }

    @GetMapping("/{mentorId}/learners")
    public ResponseEntity<?> getLearnersForMentor(@PathVariable String mentorId) {

        // Lấy learnerId từ EXERCISE hoặc LEARNING_SESSION
        List<String> learnerIds = exerciseRepo.findByMentorId(mentorId)
                .stream()
                .map(e -> e.getLearnerId())
                .distinct()
                .toList();

        // Query user info theo learnerId
        List<User> learners = userRepo.findAllById(
                learnerIds.stream().map(Long::parseLong).toList()
        );

        return ResponseEntity.ok(learners);
    }
}
