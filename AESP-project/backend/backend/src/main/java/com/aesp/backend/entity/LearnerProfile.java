package com.aesp.backend.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "learner_profiles")
public class LearnerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // ------ Thông tin cá nhân ------
    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Temporal(TemporalType.DATE)
    @Column(name = "dob")
    private Date dob;

    @Column(name = "gender")
    private String gender;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "current_level_code")
    private String currentLevelCode;

    @Column(name = "daily_learning_goal_minutes")
    private Integer dailyLearningGoalMinutes;

    @Column(name = "assessment_score")
    private Double assessmentScore;

    @Column(name = "subscription_end_date")
    private Date subscriptionEndDate;

    @ManyToOne
    @JoinColumn(name = "current_package_id")
    private ServicePackage currentPackage;

    @Enumerated(EnumType.STRING)
    @Column(name = "learning_mode")
    private LearningMode learningMode;

    @ManyToOne
    @JoinColumn(name = "main_goal_id")
    private LearnerGoal mainGoal;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileInterest> interests;

    // Enum cho Learning Mode
    public enum LearningMode {
        FULL_SENTENCE,
        KEY_PHRASE
    }

    // ============= CONSTRUCTORS =============

    public LearnerProfile() {
        this.interests = new ArrayList<>();
    }

    // ============= GETTERS & SETTERS =============

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
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

    public String getCurrentLevelCode() {
        return currentLevelCode;
    }

    public void setCurrentLevelCode(String currentLevelCode) {
        this.currentLevelCode = currentLevelCode;
    }

    public Integer getDailyLearningGoalMinutes() {
        return dailyLearningGoalMinutes;
    }

    public void setDailyLearningGoalMinutes(Integer dailyLearningGoalMinutes) {
        this.dailyLearningGoalMinutes = dailyLearningGoalMinutes;
    }

    public Double getAssessmentScore() {
        return assessmentScore;
    }

    public void setAssessmentScore(Double assessmentScore) {
        this.assessmentScore = assessmentScore;
    }

    public Date getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public void setSubscriptionEndDate(Date subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public ServicePackage getCurrentPackage() {
        return currentPackage;
    }

    public void setCurrentPackage(ServicePackage currentPackage) {
        this.currentPackage = currentPackage;
    }

    public LearningMode getLearningMode() {
        return learningMode;
    }

    public void setLearningMode(LearningMode learningMode) {
        this.learningMode = learningMode;
    }

    public LearnerGoal getMainGoal() {
        return mainGoal;
    }

    public void setMainGoal(LearnerGoal mainGoal) {
        this.mainGoal = mainGoal;
    }

    public List<ProfileInterest> getInterests() {
        return interests;
    }

    public void setInterests(List<ProfileInterest> interests) {
        this.interests = interests;
    }
}