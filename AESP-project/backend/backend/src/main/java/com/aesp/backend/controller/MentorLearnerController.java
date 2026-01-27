package com.aesp.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/mentor")
@CrossOrigin(origins = "http://localhost:5173")
public class MentorLearnerController {

    private final LearnerProfileRepository learnerProfileRepo;
    private final UserRepository userRepo;

    public MentorLearnerController(
            LearnerProfileRepository learnerProfileRepo,
            UserRepository userRepo
    ) {
        this.learnerProfileRepo = learnerProfileRepo;
        this.userRepo = userRepo;
    }

    private User getCurrentMentor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
    }

    @GetMapping("/learners")
    public ResponseEntity<?> getLearnersForMentor() {
        User mentor = getCurrentMentor();

        List<Map<String, Object>> learners =
                learnerProfileRepo.findAll()
                        .stream()
                        .filter(p -> p.getSelectedMentor() != null)
                        .filter(p -> mentor.getId().equals(p.getSelectedMentor().getId()))
                        .map(p -> {
                            User u = p.getUser();

                            Map<String, Object> map = new HashMap<>();
                            map.put("id", u.getId());
                            map.put("fullName", u.getFullName());
                            map.put("email", u.getEmail());
                            map.put("avatarUrl", u.getAvatarUrl());
                            map.put("conversationId", p.getProfileId());

                            return map;
                        })
                        .toList();

        return ResponseEntity.ok(learners);
    }
}
