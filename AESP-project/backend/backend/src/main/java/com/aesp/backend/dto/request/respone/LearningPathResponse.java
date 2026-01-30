package com.aesp.backend.dto.request.respone;

import java.util.Date;

public class LearningPathResponse {
    
    private Long pathId;
    private String level;
    private String goalCode;
    private String topicCode;
    private String description;
    private Date createdAt;
    private Date updatedAt;
    
    // ===== GETTERS & SETTERS =====
    
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
