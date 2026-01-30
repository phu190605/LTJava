package com.aesp.backend.dto.request;

public class EnrollLearningPathRequest {
    private String level;
    private String goalCode;
    private String topicCode;
    
    public EnrollLearningPathRequest() {}
    
    public EnrollLearningPathRequest(String level, String goalCode, String topicCode) {
        this.level = level;
        this.goalCode = goalCode;
        this.topicCode = topicCode;
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
    
    @Override
    public String toString() {
        return "EnrollLearningPathRequest{" +
                "level='" + level + '\'' +
                ", goalCode='" + goalCode + '\'' +
                ", topicCode='" + topicCode + '\'' +
                '}';
    }
}
