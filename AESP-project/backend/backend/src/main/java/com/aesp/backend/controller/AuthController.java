package com.aesp.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.dto.request.LoginRequest;
import com.aesp.backend.dto.request.SignupRequest;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    // API ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email đã tồn tại!");
        }

        // Tạo user mới
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa pass

        userRepository.save(user);

        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // API ĐĂNG NHẬP (Giả lập trả về Token)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> userOp = userRepository.findByEmail(request.getEmail());

        if (userOp.isPresent()) {
            User user = userOp.get();
            // Kiểm tra mật khẩu (pass nhập vào vs pass đã mã hóa trong DB)
            boolean passMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            logger.info("Login attempt email='{}' role='{}' passMatches={}", request.getEmail(), user.getRole(), passMatches);
            if (passMatches) {
                
                // Ở đây sau này sẽ sinh JWT Token thật. 
                // Tạm thời trả về Map để test trước.
                Map<String, String> response = new HashMap<>();
                response.put("token", "fake-jwt-token-cho-vui-123456"); 
                response.put("role", user.getRole());
                response.put("email", user.getEmail());
                response.put("fullName", user.getFullName());
                
                return ResponseEntity.ok(response);
            }
        }
        logger.info("Login failed for email='{}' (not found or mismatch)", request.getEmail());

        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }

    // API ĐĂNG NHẬP ADMIN (Chỉ cho phép tài khoản admin)
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        Optional<User> userOp = userRepository.findByEmail(request.getEmail());

        if (userOp.isPresent()) {
            User user = userOp.get();
            
            // Kiểm tra xem user có phải admin không
            logger.info("Admin login attempt email='{}' role='{}'", request.getEmail(), user.getRole());
            if (!"ADMIN".equals(user.getRole())) {
                logger.warn("Admin login rejected for '{}': not ADMIN (role={})", request.getEmail(), user.getRole());
                return ResponseEntity.badRequest().body("Bạn không có quyền truy cập admin!");
            }

            boolean passMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            logger.info("Admin password match for '{}': {}", request.getEmail(), passMatches);
            if (passMatches) {
                Map<String, String> response = new HashMap<>();
                response.put("token", "fake-jwt-admin-token-123456");
                response.put("role", user.getRole());
                response.put("email", user.getEmail());
                response.put("fullName", user.getFullName());
                
                return ResponseEntity.ok(response);
            }
        }
        logger.info("Admin login failed for email='{}' (not found or mismatch)", request.getEmail());

        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }

    // Temporary debug endpoint (development only) to inspect user row
    @GetMapping("/debug/user")
    public ResponseEntity<?> debugUser(@RequestParam String email) {
        Optional<User> userOp = userRepository.findByEmail(email);
        if (userOp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOp.get();
        Map<String, String> resp = new HashMap<>();
        resp.put("email", user.getEmail());
        resp.put("role", user.getRole());
        resp.put("fullName", user.getFullName());
        resp.put("passwordHash", user.getPassword());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/debug/check-password")
    public ResponseEntity<?> checkPassword(@RequestParam String email, @RequestParam String password) {
        Optional<User> userOp = userRepository.findByEmail(email);
        if (userOp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOp.get();
        boolean matches = passwordEncoder.matches(password, user.getPassword());
        Map<String, Object> resp = new HashMap<>();
        resp.put("email", email);
        resp.put("matches", matches);
        resp.put("storedHash", user.getPassword());
        return ResponseEntity.ok(resp);
    }
}