package com.aesp.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "topics")
@Data
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_id")
    private Integer topicId;

    @Column(name = "topic_name")
    private String topicName;
    @Column(name = "topic_code")
    private String topicCode;
    @Column(name = "icon_url")
    private String iconUrl;

    // BỔ SUNG DÒNG NÀY
    private String description;

    @Enumerated(EnumType.STRING)
    private Category category;

    public enum Category {
        GENERAL, SPECIALIZED
    }

    // ============= GETTERS & SETTERS =============

    public Integer getTopicId() {
        return topicId;
    }

    public void setTopicId(Integer topicId) {
        this.topicId = topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }
}