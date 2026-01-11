package com.aesp.backend.entity;

import jakarta.persistence.*;

@Entity
public class LearningMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String mentorId;
    private String title;
    private String fileUrl;
    private String type;

    public String getId() { return id; }
    public String getMentorId() { return mentorId; }
    public String getTitle() { return title; }
    public String getFileUrl() { return fileUrl; }
    public String getType() { return type; }

    public void setMentorId(String mentorId) { this.mentorId = mentorId; }
    public void setTitle(String title) { this.title = title; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setType(String type) { this.type = type; }
}
