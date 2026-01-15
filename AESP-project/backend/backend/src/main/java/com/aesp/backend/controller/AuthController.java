package com.aesp.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aesp.backend.dto.request.LoginRequest;
import com.aesp.backend.dto.request.SignupRequest;
import com.aesp.backend.entity.User;
import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    LearnerProfileRepository learnerProfileRepository; // Thêm repository để check profile

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email đã tồn tại!");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole("LEARNER");
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setTested(false); 

        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> userOp = userRepository.findByEmail(request.getEmail());

        if (userOp.isPresent()) {
            User user = userOp.get();
            boolean passMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            
            if (passMatches) {
                String token = jwtUtils.generateToken(user.getEmail());
                
                // KIỂM TRA TRẠNG THÁI SETUP MỤC TIÊU/LỘ TRÌNH
                boolean isSetupComplete = false;
                Optional<LearnerProfile> profileOp = learnerProfileRepository.findByUser_Id(user.getId());
                if (profileOp.isPresent()) {
                    isSetupComplete = profileOp.get().isSetupComplete();
                }
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole());
                response.put("email", user.getEmail());
                response.put("fullName", user.getFullName());
                response.put("isTested", user.isTested());
                response.put("level", user.getLevel());
                // TRẢ VỀ TRẠNG THÁI SETUP ĐỂ FRONTEND ĐIỀU HƯỚNG
                response.put("isSetupComplete", isSetupComplete); 

                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        Optional<User> userOp = userRepository.findByEmail(request.getEmail());

        if (userOp.isPresent()) {
            User user = userOp.get();
            if (!"ADMIN".equals(user.getRole())) {
                return ResponseEntity.badRequest().body("Bạn không có quyền truy cập admin!");
            }

            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtils.generateToken(user.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole());
                response.put("email", user.getEmail());
                response.put("fullName", user.getFullName());
                response.put("isTested", user.isTested());

                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }

    @GetMapping("/debug/user")
    public ResponseEntity<?> debugUser(@RequestParam String email) {
        Optional<User> userOp = userRepository.findByEmail(email);
        if (userOp.isEmpty()) return ResponseEntity.notFound().build();
        
        User user = userOp.get();
        
        boolean isSetupComplete = false;
        Optional<LearnerProfile> profileOp = learnerProfileRepository.findByUser_Id(user.getId());
        if (profileOp.isPresent()) {
            isSetupComplete = profileOp.get().isSetupComplete();
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("email", user.getEmail());
        resp.put("isTested", user.isTested());
        resp.put("level", user.getLevel());
        resp.put("isSetupComplete", isSetupComplete);
        return ResponseEntity.ok(resp);
    }
}