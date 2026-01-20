package com.aesp.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProfileResponseRequest {

    // ============= FIELDS =============

    // Từ bảng User
    private String fullName;
    private String email;

    // Từ bảng LearnerProfile
    private String avatarUrl;
    private String phoneNumber;
    private Date dob;
    private String gender;
    private String occupation;
    private String currentLevel;
    private Integer dailyGoalMinutes;
    private String learningMode;
    private String displayName;
    private Integer dailyTime;
    private Double assessmentScore;
    private Integer mainGoalId;
    private Integer packageId;

    // Thông tin định danh từ các bảng liên kết
    private String mainGoalName;
    private List<String> interestNames;
    private List<Integer> interestTopicIds;

    // ============= CONSTRUCTORS =============

    public ProfileResponseRequest() {
    }

    // ============= GETTERS & SETTERS =============

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(String currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Integer getDailyGoalMinutes() {
        return dailyGoalMinutes;
    }

    public void setDailyGoalMinutes(Integer dailyGoalMinutes) {
        this.dailyGoalMinutes = dailyGoalMinutes;
    }

    public String getLearningMode() {
        return learningMode;
    }

    public void setLearningMode(String learningMode) {
        this.learningMode = learningMode;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Integer getDailyTime() {
        return dailyTime;
    }

    public void setDailyTime(Integer dailyTime) {
        this.dailyTime = dailyTime;
    }

    public Double getAssessmentScore() {
        return assessmentScore;
    }

    public void setAssessmentScore(Double assessmentScore) {
        this.assessmentScore = assessmentScore;
    }

    public Integer getMainGoalId() {
        return mainGoalId;
    }

    public void setMainGoalId(Integer mainGoalId) {
        this.mainGoalId = mainGoalId;
    }

    public Integer getPackageId() {
        return packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }

    public String getMainGoalName() {
        return mainGoalName;
    }

    public void setMainGoalName(String mainGoalName) {
        this.mainGoalName = mainGoalName;
    }

    public List<String> getInterestNames() {
        return interestNames;
    }

    public void setInterestNames(List<String> interestNames) {
        this.interestNames = interestNames;
    }

    public List<Integer> getInterestTopicIds() {
        return interestTopicIds;
    }

    public void setInterestTopicIds(List<Integer> interestTopicIds) {
        this.interestTopicIds = interestTopicIds;
    }
}