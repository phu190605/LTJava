package com.aesp.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.dto.request.AssignSkillsRequest;
import com.aesp.backend.dto.request.CreateMentorRequest;
import com.aesp.backend.entity.User;
import com.aesp.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/mentors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminMentorController {

    private final UserService userService;

    @PostMapping
    public User createMentor(@RequestBody CreateMentorRequest request) {
        return userService.createMentor(request);
    }

    @GetMapping
    public List<User> getAllMentors() {
        return userService.getAllMentors();
    }

    @PostMapping("/assign-skills")
    public void assignSkills(@RequestBody AssignSkillsRequest request) {
        userService.assignSkillsToMentor(
            request.getMentorId(),
            request.getSkills()
        );
    }
}
