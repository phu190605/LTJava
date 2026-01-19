package com.aesp.backend.controller;

import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/mentors")
@CrossOrigin("*")
public class MentorPublicController {

    private final UserRepository userRepo;

    public MentorPublicController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * API PUBLIC cho Learner
     * Lấy toàn bộ user có role = MENTOR + active = true
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllMentors() {
        List<User> mentors = userRepo.findByRoleAndActive("MENTOR", true);
        return ResponseEntity.ok(mentors);
    }
}
