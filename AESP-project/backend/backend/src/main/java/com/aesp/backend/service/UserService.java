package com.aesp.backend.service;

import java.util.List;

import com.aesp.backend.dto.request.CreateMentorRequest;
import com.aesp.backend.entity.User;

public interface UserService {

    // User management
    List<User> getAllUsers();
    void disableUser(Long userId);

    // Mentor management
    User createMentor(CreateMentorRequest request);
    List<User> getAllMentors();
    void assignSkillsToMentor(Long mentorId, List<String> skills);
}
