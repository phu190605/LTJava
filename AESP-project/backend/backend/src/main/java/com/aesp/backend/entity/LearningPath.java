package com.aesp.backend.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learning_paths")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "path_id")
    private Long pathId;

    // ===== CẤP ĐỘ (A1, A2, B1, B2, C1, C2) =====
    @Column(name = "level")
    private String level;

    // ===== MỤC TIÊU HỌC TẬP (CAREER, EDUCATION, TRAVEL, SOCIAL) =====
    @Column(name = "goal_code")
    private String goalCode;

    // ===== CHỦ ĐỀ HỌC TẬP (COOKING, SPORTS, MUSIC, TECH) =====
    @Column(name = "topic_code")
    private String topicCode;

    // ===== MÔ TẢ LỘ TRÌNH =====
    @Column(name = "description", columnDefinition = "text")
    private String description;

    // ===== NGÀY TẠO & CẬP NHẬT =====
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    // ===== LIFECYCLE CALLBACKS =====
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }

    // ===== EXPLICIT GETTERS & SETTERS (For Lombok compatibility) =====
    public Long getPathId() {
        return pathId;
    }

    public void setPathId(Long pathId) {
        this.pathId = pathId;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getGoalCode() {
        return goalCode;
    }

    public void setGoalCode(String goalCode) {
        this.goalCode = goalCode;
    }

    public String getTopicCode() {
        return topicCode;
    }

    public void setTopicCode(String topicCode) {
        this.topicCode = topicCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
