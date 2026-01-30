package com.aesp.backend.dto.request;

public class LearningPathRequest {
    
    private String level;
    private String goalCode;
    private String topicCode;
    private String description;
    
    // ===== GETTERS & SETTERS =====
    
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
}
