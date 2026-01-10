package com.aesp.backend.dto.request;
import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String fullName;
    private String role; // Frontend gửi lên "LEARNER" hoặc "MENTOR"
}