package com.aesp.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aesp.backend.dto.request.ForgotPasswordRequest;
import com.aesp.backend.dto.request.LoginRequest;
import com.aesp.backend.dto.request.ResetPasswordRequest;
import com.aesp.backend.dto.request.SignupRequest;
import com.aesp.backend.dto.request.TestEmailRequest;
import com.aesp.backend.dto.request.VerifyOtpRequest;
import com.aesp.backend.entity.User;
import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.security.JwtUtils; // Đã đổi từ JwtUtils thành JwtUtil
import com.aesp.backend.service.EmailService;
import com.aesp.backend.service.IUserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    UserRepository userRepository;

    @Autowired
    LearnerProfileRepository learnerProfileRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils; // Sử dụng JwtUtils đồng nhất

    @Autowired
    IUserService userService;

    @Autowired
    EmailService emailService;

    // ================= 1. AUTHENTICATION (LOGIN/REGISTER) =================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> userOp = userRepository.findByEmail(request.getEmail());

        if (userOp.isPresent()) {
            User user = userOp.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtils.generateToken(user.getEmail());
                
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
                response.put("level", user.getLevel() != null ? user.getLevel() : "A1");
                response.put("isSetupComplete", isSetupComplete); 

                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }

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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Error: Token không hợp lệ!");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());
        response.put("isTested", user.isTested());
        response.put("level", user.getLevel() != null ? user.getLevel() : "A1");

        boolean isSetupComplete = false;
        Optional<LearnerProfile> profileOp = learnerProfileRepository.findByUser_Id(user.getId());
        if (profileOp.isPresent()) {
            isSetupComplete = profileOp.get().isSetupComplete();
        }
        response.put("isSetupComplete", isSetupComplete);

        return ResponseEntity.ok(response);
    }

    // ================= 2. PASSWORD RESET (OTP / FORGOT) =================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());
        return ResponseEntity.ok().body("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String token = userService.verifyOtp(request.getEmail(), request.getOtp());
        if (token != null) {
            Map<String, String> resp = new HashMap<>();
            resp.put("token", token);
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.badRequest().body("OTP không hợp lệ hoặc đã hết hạn.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean ok = userService.resetPassword(request.getToken(), request.getNewPassword());
        if (ok) {
            return ResponseEntity.ok().body("Đặt lại mật khẩu thành công!");
        }
        return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn.");
    }

    // ================= 3. ADMIN & DEBUG =================

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        Optional<User> userOp = userRepository.findByEmail(request.getEmail());
        if (userOp.isPresent() && "ADMIN".equals(userOp.get().getRole())) {
            if (passwordEncoder.matches(request.getPassword(), userOp.get().getPassword())) {
                String token = jwtUtils.generateToken(userOp.get().getEmail());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", "ADMIN");
                response.put("email", userOp.get().getEmail());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.badRequest().body("Truy cập bị từ chối!");
    }

    @GetMapping("/debug/user")
    public ResponseEntity<?> debugUser(@RequestParam String email) {
        Optional<User> userOp = userRepository.findByEmail(email);
        if (userOp.isEmpty()) return ResponseEntity.notFound().build();
        
        User user = userOp.get();
        Map<String, Object> resp = new HashMap<>();
        resp.put("email", user.getEmail());
        resp.put("resetToken", user.getResetToken());
        resp.put("resetOtp", user.getResetOtp());
        resp.put("level", user.getLevel());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/debug/send-test-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody TestEmailRequest request) {
        boolean ok = emailService.sendTestEmail(request.getEmail(), request.getSubject(), request.getMessage());
        return ok ? ResponseEntity.ok("Đã gửi email test") : ResponseEntity.internalServerError().body("Gửi mail thất bại");
    }
}