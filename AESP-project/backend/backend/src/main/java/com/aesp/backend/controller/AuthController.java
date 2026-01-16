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

import com.aesp.backend.dto.request.*;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.security.JwtUtils;
import com.aesp.backend.service.EmailService;
import com.aesp.backend.service.IUserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    IUserService userService;

    @Autowired
    EmailService emailService;

    // ================= QUÊN MẬT KHẨU =================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean ok = userService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );
        if (ok) {
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        }
        return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn.");
    }

    // ================= ĐĂNG KÝ =================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email đã tồn tại!");
        }

        if (request.getRole() != null && !"LEARNER".equalsIgnoreCase(request.getRole())) {
            return ResponseEntity.badRequest().body("Error: Chỉ admin mới được tạo tài khoản mentor!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole("LEARNER");
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);

        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // ================= ĐĂNG NHẬP =================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {

        Optional<User> userOp = userRepository.findByEmail(request.getEmail());
        if (userOp.isPresent()) {
            User user = userOp.get();
            boolean passMatches = passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );

            logger.info("Login email='{}' role='{}' passMatches={}",
                    request.getEmail(), user.getRole(), passMatches);

            if (passMatches) {
                String token = jwtUtils.generateToken(user.getEmail());
                Map<String, String> resp = new HashMap<>();
                resp.put("token", token);
                resp.put("role", user.getRole());
                resp.put("email", user.getEmail());
                resp.put("fullName", user.getFullName());
                return ResponseEntity.ok(resp);
            }
        }

        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }

    // ================= ADMIN LOGIN =================

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {

        Optional<User> userOp = userRepository.findByEmail(request.getEmail());
        if (userOp.isPresent()) {
            User user = userOp.get();

            if (!"ADMIN".equals(user.getRole())) {
                return ResponseEntity.badRequest().body("Bạn không có quyền truy cập admin!");
            }

            boolean passMatches = passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );

            if (passMatches) {
                String token = jwtUtils.generateToken(user.getEmail());
                Map<String, String> resp = new HashMap<>();
                resp.put("token", token);
                resp.put("role", user.getRole());
                resp.put("email", user.getEmail());
                resp.put("fullName", user.getFullName());
                return ResponseEntity.ok(resp);
            }
        }

        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
    }

    // ================= DEBUG =================

    @GetMapping("/debug/user")
    public ResponseEntity<?> debugUser(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    Map<String, String> resp = new HashMap<>();
                    resp.put("email", user.getEmail());
                    resp.put("role", user.getRole());
                    resp.put("fullName", user.getFullName());
                    resp.put("passwordHash", user.getPassword());
                    resp.put("resetToken", user.getResetToken());
                    resp.put("resetOtp", user.getResetOtp());
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/debug/send-test-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody TestEmailRequest request) {
        boolean ok = emailService.sendTestEmail(
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );
        return ok
                ? ResponseEntity.ok("Test email sent")
                : ResponseEntity.status(500).body("Send email failed");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String token = userService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );
        if (token != null) {
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.badRequest().body("OTP không hợp lệ hoặc đã hết hạn.");
    }
}
