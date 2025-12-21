package com.aesp.backend.controller;

import com.aesp.backend.dto.request.LoginRequest;
import com.aesp.backend.dto.request.SignupRequest;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

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
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                
                // Ở đây sau này sẽ sinh JWT Token thật. 
                // Tạm thời trả về Map để test trước.
                Map<String, String> response = new HashMap<>();
                response.put("token", "fake-jwt-token-cho-vui-123456"); 
                response.put("role", user.getRole());
                response.put("email", user.getEmail());
                
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }
}