package com.aesp.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore //không trả password ra API
    private String password;

    // ADMIN / MENTOR / LEARNER
    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String fullName;

    // enable / disable user
    @Column(nullable = false)
    private boolean active = true;

    // ===== Mentor skills =====
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "mentor_skills",
        joinColumns = @JoinColumn(name = "mentor_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @JsonManagedReference
    private Set<Skill> skills = new HashSet<>();

    // ===== CONSTRUCTOR =====
    public User() {}

    // ===== GETTER & SETTER =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }
 
    public void setEmail(String email) {
        this.email = email;
    }
 
    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
 
    public String getRole() {
        return role;
    }
 
    public void setRole(String role) {
        this.role = role;
    }
 
    public String getFullName() {
        return fullName;
    }
 
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Set<Skill> getSkills() {
        return skills;
    }
 
    public void setSkills(Set<Skill> skills) {
        this.skills = skills;
    }
}
