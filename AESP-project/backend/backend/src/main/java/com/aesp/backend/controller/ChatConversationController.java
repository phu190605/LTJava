package com.aesp.backend.controller;

import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;
import com.aesp.backend.security.JwtUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatConversationController {

    private final UserRepository userRepo;
    private final LearnerProfileRepository learnerProfileRepo;
    private final ConversationRepository conversationRepo;
    private final JwtUtils jwtUtils;

    public ChatConversationController(
            UserRepository userRepo,
            LearnerProfileRepository learnerProfileRepo,
            ConversationRepository conversationRepo,
            JwtUtils jwtUtils
    ) {
        this.userRepo = userRepo;
        this.learnerProfileRepo = learnerProfileRepo;
        this.conversationRepo = conversationRepo;
        this.jwtUtils = jwtUtils;
    }

    // Learner mở chat với mentor đã đăng ký
    @GetMapping("/conversation/learner")
    public Conversation getOrCreateConversationForLearner(
            @RequestHeader("Authorization") String token
    ) {
        String email = jwtUtils.getEmailFromToken(token.substring(7));
        User learner = userRepo.findByEmail(email).orElseThrow();

        LearnerProfile profile = learnerProfileRepo.findByUser(learner)
                .orElseThrow(() -> new RuntimeException("Learner profile not found"));

        User mentor = profile.getSelectedMentor();
        if (mentor == null) {
            throw new RuntimeException("Learner chưa chọn mentor");
        }

        return conversationRepo
                .findByLearnerAndMentor(learner, mentor)
                .orElseGet(() -> conversationRepo.save(
                        new Conversation(learner, mentor)
                ));
    }

    // Mentor mở chat với learner
    @GetMapping("/conversation/mentor/{learnerId}")
    public Conversation getOrCreateConversationForMentor(
            @RequestHeader("Authorization") String token,
            @PathVariable Long learnerId
    ) {
        String email = jwtUtils.getEmailFromToken(token.substring(7));
        User mentor = userRepo.findByEmail(email).orElseThrow();
        User learner = userRepo.findById(learnerId).orElseThrow();

        return conversationRepo
                .findByLearnerAndMentor(learner, mentor)
                .orElseGet(() -> conversationRepo.save(
                        new Conversation(learner, mentor)
                ));
    }
}
