package com.aesp.backend.dto.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;

    public ForgotPasswordRequest() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}