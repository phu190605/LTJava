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

import com.aesp.backend.dto.request.ForgotPasswordRequest;
import com.aesp.backend.dto.request.LoginRequest;
import com.aesp.backend.dto.request.ResetPasswordRequest;
import com.aesp.backend.dto.request.SignupRequest;
import com.aesp.backend.dto.request.TestEmailRequest;
import com.aesp.backend.dto.request.VerifyOtpRequest;
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
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private IUserService userService;

    @Autowired
    private EmailService emailService;

    // ================= ĐĂNG KÝ =================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole("LEARNER"); // chỉ learner tự đăng ký
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);

        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // ================= ĐĂNG NHẬP (DÙNG CHO ADMIN / MENTOR / LEARNER) =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> userOp = userRepository.findByEmail(request.getEmail());
        if (userOp.isEmpty()) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
        }

        User user = userOp.get();
        boolean passMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        logger.info("Login email={} role={} pass={}",
                user.getEmail(), user.getRole(), passMatches);

        if (!passMatches) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu!");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    // ================= QUÊN / RESET MẬT KHẨU =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Nếu email tồn tại, hướng dẫn đã được gửi.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean ok = userService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );
        return ok
                ? ResponseEntity.ok("Đặt lại mật khẩu thành công!")
                : ResponseEntity.badRequest().body("Token không hợp lệ hoặc hết hạn.");
    }

    // ================= DEBUG =================
    @GetMapping("/debug/user")
    public ResponseEntity<?> debugUser(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("id", user.getId());
                    resp.put("email", user.getEmail());
                    resp.put("role", user.getRole());
                    resp.put("fullName", user.getFullName());
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
        return token != null
                ? ResponseEntity.ok(Map.of("token", token))
                : ResponseEntity.badRequest().body("OTP không hợp lệ hoặc hết hạn.");
    }
}