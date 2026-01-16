package com.aesp.backend.dto.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
    // Constructor mặc định
    public ForgotPasswordRequest() {}

    // Getter & Setter thủ công
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}