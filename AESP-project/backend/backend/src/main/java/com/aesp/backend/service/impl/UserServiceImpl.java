package com.aesp.backend.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aesp.backend.dto.request.CreateMentorRequest;
import com.aesp.backend.entity.Skill;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.SkillRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.service.UserService;

import jakarta.transaction.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private static final String ROOT_ADMIN_EMAIL = "admin@aesp.com";

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            SkillRepository skillRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================================
    // SPRING SECURITY
    // ==========================================================
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Không tìm thấy user với email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority(user.getRole())
                )
        );
    }

    // ==========================================================
    // HELPER: chặn admin gốc
    // ==========================================================
    private void blockRootAdmin(User user) {
        if (ROOT_ADMIN_EMAIL.equalsIgnoreCase(user.getEmail())) {
            throw new RuntimeException("Không thể thao tác với admin hệ thống");
        }
    }

    // ==========================================================
    // 1️⃣ Tạo mentor
    // ==========================================================
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

    // ==========================================================
    // 2️⃣ Lấy danh sách mentor
    // ==========================================================
    @Override
    public List<User> getAllMentors() {
        return userRepository.findByRole("MENTOR");
    }

    // ==========================================================
    // 3️⃣ Gán skills cho mentor
    // ==========================================================
    @Override
    @Transactional
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

    // ==========================================================
    // 4️⃣ Xóa mentor
    // ==========================================================
    @Override
    @Transactional
    public void deleteMentor(Long mentorId) {
        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        mentor.getSkills().clear();
        userRepository.delete(mentor);
    }

    // ==========================================================
    // 5️⃣ Gỡ skill khỏi mentor
    // ==========================================================
    @Override
    @Transactional
    public void removeSkillFromMentor(Long mentorId, Long skillId) {
        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        mentor.getSkills().removeIf(skill -> skill.getId().equals(skillId));
    }

    // ==========================================================
    // 6️⃣ USER MANAGEMENT (ADMIN)
    // ==========================================================
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> !ROOT_ADMIN_EMAIL.equalsIgnoreCase(u.getEmail()))
                .toList();
    }

    @Override
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        blockRootAdmin(user);

        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        blockRootAdmin(user);

        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        blockRootAdmin(user);

        if (!"LEARNER".equals(user.getRole())) {
            throw new RuntimeException("Only Learner can be deleted");
        }

        userRepository.delete(user);
    }
}
