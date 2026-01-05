package com.aesp.backend.dto.response;

public class LoginResponse {
    private String token;
    private Long id;
    private String role;
    private String fullName;
    private String email;

    // Constructor
    public LoginResponse(String token, Long id, String role, String fullName, String email) {
        this.token = token;
        this.id = id;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }

    // Getter & Setter
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}