package com.aesp.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;

@Service
public class UserServiceImpl implements IUserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public void forgotPassword(String email) {
        Optional<User> userOp = userRepository.findByEmail(email);
        if (userOp.isPresent()) {
            User user = userOp.get();

            // 1. Tạo OTP 6 số ngẫu nhiên
            String otp = String.format("%06d", (int)(Math.random() * 1000000));
            
            // 2. Lưu vào DB
            user.setResetOtp(otp);
            user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            // 3. Gọi EmailService để gửi mail đẹp
            emailService.sendPasswordResetOtpEmail(user, otp);

            // Log ra console để bạn dễ test nếu không mở được MailHog
            logger.info("=== DEBUG OTP: Email: {} | Code: {} ===", email, otp);
        } else {
            logger.warn("Yêu cầu quên mật khẩu cho email không tồn tại: {}", email);
        }
    }

    @Override
    public String verifyOtp(String email, String otp) {
        Optional<User> userOp = userRepository.findByEmail(email);
        if (userOp.isPresent()) {
            User user = userOp.get();
            // Kiểm tra khớp mã và còn hạn
            if (user.getResetOtp() != null 
                && user.getResetOtp().equals(otp) 
                && user.getResetOtpExpiry() != null
                && user.getResetOtpExpiry().isAfter(LocalDateTime.now())) {
                
                // OTP đúng -> Sinh Token bảo mật để đổi pass
                String token = UUID.randomUUID().toString();
                user.setResetToken(token);
                user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
                
                // Xóa OTP cũ để không dùng lại được
                user.setResetOtp(null);
                user.setResetOtpExpiry(null);
                userRepository.save(user);
                
                return token; // Trả về token cho Frontend
            }
        }
        return null;
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOp = userRepository.findByResetToken(token);
        if (userOp.isPresent()) {
            User user = userOp.get();
            if (user.getResetTokenExpiry() != null && user.getResetTokenExpiry().isAfter(LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                // Xóa token sau khi dùng xong
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}