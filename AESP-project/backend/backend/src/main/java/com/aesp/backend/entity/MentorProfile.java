package com.aesp.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mentor_profiles")
public class MentorProfile {

    @Id
    @Column(name = "mentor_id")
    private String id;

    private String fullName;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "mentor_skills",
            joinColumns = @JoinColumn(name = "mentor_id")
    )
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "mentor_certificates",
            joinColumns = @JoinColumn(name = "mentor_id")
    )
    @Column(name = "certificate")
    private List<String> certificates = new ArrayList<>();

    public MentorProfile() {}


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) {
        this.skills = (skills == null) ? new ArrayList<>() : skills;
    }

    public List<String> getCertificates() { return certificates; }
    public void setCertificates(List<String> certificates) {
        this.certificates = (certificates == null) ? new ArrayList<>() : certificates;
    }
}
