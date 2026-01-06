package com.aesp.backend.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aesp.backend.dto.request.CreateMentorRequest;
import com.aesp.backend.entity.Skill;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.SkillRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    // =========================
    // 1️⃣ Tạo mentor
    // =========================
    @Override
    public User createMentor(CreateMentorRequest request) {

        User mentor = new User();
        mentor.setEmail(request.getEmail());
        mentor.setFullName(request.getFullName());
        mentor.setRole("MENTOR");
        mentor.setPassword(passwordEncoder.encode(request.getPassword()));
        mentor.setActive(true);

        return userRepository.save(mentor);
    }

    // =========================
    // 2️⃣ Lấy danh sách mentor
    // =========================
    @Override
    public List<User> getAllMentors() {
        return userRepository.findByRole("MENTOR");
    }

    // =========================
    // 3️⃣ Gán skills cho mentor
    // =========================
    @Override
    public void assignSkillsToMentor(Long mentorId, List<String> skills) {

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        Set<Skill> skillSet = new HashSet<>();

        for (String skillName : skills) {
            Skill skill = skillRepository.findByName(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = new Skill();
                        newSkill.setName(skillName);
                        return skillRepository.save(newSkill);
                    });
            skillSet.add(skill);
        }

        mentor.setSkills(skillSet);
        userRepository.save(mentor);
    }

    // =========================
    // 4️⃣ Xóa mentor (xóa hẳn)
    // =========================
    @Override
    @Transactional
    public void deleteMentor(Long mentorId) {

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // Gỡ quan hệ many-to-many
        mentor.getSkills().clear();

        userRepository.delete(mentor);
    }

    // =========================
    // 5️⃣ Gỡ skill khỏi mentor
    // =========================
    @Override
    @Transactional
    public void removeSkillFromMentor(Long mentorId, Long skillId) {

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        mentor.getSkills().removeIf(skill -> skill.getId().equals(skillId));
    }

    // =========================
    // 6️⃣ User management
    // =========================
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void disableUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        userRepository.save(user);
    }
}
