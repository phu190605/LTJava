package com.aesp.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class LearningMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String mentorId;
    private String learnerId;
    private String title;
    private String fileUrl;
    private String type; // PDF / AUDIO

    // ===== GETTERS =====
    public String getId() {
        return id;
    }

    public String getMentorId() {
        return mentorId;
    }

    public String getLearnerId() {
        return learnerId;
    }

    public String getTitle() {
        return title;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public String getType() {
        return type;
    }

    // ===== SETTERS =====
    public void setId(String id) {
        this.id = id;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public void setLearnerId(String learnerId) {
        this.learnerId = learnerId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public void setType(String type) {
        this.type = type;
    }
}
