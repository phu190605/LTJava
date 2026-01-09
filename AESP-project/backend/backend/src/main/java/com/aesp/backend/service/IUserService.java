package com.aesp.backend.service;

public interface IUserService {
    void forgotPassword(String email);
    boolean resetPassword(String token, String newPassword);

    // Verify the OTP sent to email and if valid generate+return a reset token
    String verifyOtp(String email, String otp);

} 
