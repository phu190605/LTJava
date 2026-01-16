package com.aesp.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "profile_interests")
@Data
public class ProfileInterest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private LearnerProfile profile;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;
    // ============= GETTERS & SETTERS =============

    public Long getInterestId() {
        return this.id;
    }

    public void setInterestId(Long interestId) {
        this.id = interestId;
    }

    public LearnerProfile getProfile() {
        return profile;
    }

    public void setProfile(LearnerProfile profile) {
        this.profile = profile;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }
}