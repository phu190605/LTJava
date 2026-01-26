package com.aesp.backend.entity;


import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String fullName;
    private String role; // Ví dụ: "LEARNER", "ADMIN"

    // --- QUẢN LÝ GÓI PREMIUM ---
    @Column(name = "is_premium")
    private boolean isPremium = false;

    @Column(name = "premium_expiry")
    private LocalDateTime premiumExpiry; // Ngày hết hạn gói Premium

    // --- HỖ TRỢ RESET MẬT KHẨU ---
    private String resetToken;
    private LocalDateTime resetTokenExpiry;
    private String resetOtp;
    private LocalDateTime resetOtpExpiry;

    // --- TRÌNH ĐỘ NGƯỜI DÙNG ---
    private boolean isTested = false; 
    private String level; // Ví dụ: A1, A2, B1...

    /**
     * Phương thức kiểm tra người dùng có đang trong thời gian Premium hay không.
     * Thường dùng trong logic xử lý Service hoặc Security.
     */
    public boolean hasActivePremium() {
        if (!isPremium) return false;
        if (premiumExpiry == null) return false;
        return premiumExpiry.isAfter(LocalDateTime.now());
    }
}