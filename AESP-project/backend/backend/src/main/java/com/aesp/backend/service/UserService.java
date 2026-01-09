package com.aesp.backend.service;

import java.util.List;

import com.aesp.backend.dto.request.CreateMentorRequest;
import com.aesp.backend.entity.User;

public interface UserService {

    // ===== Mentor =====
    User createMentor(CreateMentorRequest request);

    List<User> getAllMentors();

    void assignSkillsToMentor(Long mentorId, List<String> skills);

    void deleteMentor(Long mentorId);

    void removeSkillFromMentor(Long mentorId, Long skillId);

    // ===== User =====
    List<User> getAllUsers();

    void disableUser(Long userId);
    void enableUser(Long userId);
    void deleteUser(Long userId);
}
