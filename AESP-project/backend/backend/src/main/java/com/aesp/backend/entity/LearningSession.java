package com.aesp.backend.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class LearningSession implements Serializable {

    @Id
    private String id;

    private String mentorId;
    private String learnerId;
    private String topic;
    private String audioUrl;
    private String status = "WAITING"; // mặc định

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMentorId() { return mentorId; }
    public void setMentorId(String mentorId) { this.mentorId = mentorId; }

    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
