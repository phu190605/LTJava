package com.aesp.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String fullName;
    private String role;

    // Password reset support
    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    // OTP support for password reset (one-time code sent to email)
    private String resetOtp;
    private LocalDateTime resetOtpExpiry;
} 
