package com.aesp.backend.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Collections; // Thêm import này

import org.springframework.security.core.authority.SimpleGrantedAuthority; // Thêm import
import org.springframework.security.core.userdetails.UserDetails; // Thêm import
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Thêm import
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
//@RequiredArgsConstructor // <--- Nếu lỗi Lombok, hãy bỏ dòng này và dùng Constructor tay bên dưới
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    // --- CONSTRUCTOR THỦ CÔNG (Để thay thế @RequiredArgsConstructor nếu lỗi) ---
    public UserServiceImpl(UserRepository userRepository, SkillRepository skillRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================================
    // QUAN TRỌNG: HÀM NÀY BẮT BUỘC PHẢI CÓ ĐỂ SPRING SECURITY CHẠY
    // ==========================================================
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Tìm user trong DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user với email: " + email));

        // 2. Trả về đối tượng UserDetails chuẩn của Spring
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole())) // Role ví dụ: "ADMIN", "LEARNER"
        );
    }

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
        // Lưu ý: Repository phải có hàm findByRole
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
    // 4️⃣ Xóa mentor
    // =========================
    @Override
    @Transactional
    public void deleteMentor(Long mentorId) {
        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
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

    @Override
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!"LEARNER".equals(user.getRole())) {
            throw new RuntimeException("Only Learner can be deleted");
        }
        userRepository.delete(user);
    }
}