package com.aesp.backend.dto.request.respone;

public class AdminProfileResponse {
    private String email;
    private String fullName;
    private String role;

    public AdminProfileResponse(String email, String fullName, String role) {
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRole() {
        return role;
    }
}
