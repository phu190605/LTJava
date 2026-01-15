package com.aesp.backend.service;

import java.util.List;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.aesp.backend.dto.request.CreateMentorRequest;
import com.aesp.backend.entity.User;



public interface UserService extends UserDetailsService {

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
