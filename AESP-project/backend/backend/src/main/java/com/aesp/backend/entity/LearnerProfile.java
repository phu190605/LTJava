package com.aesp.backend.entity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType; // Bổ sung import Date
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
import lombok.Data;

@Entity 
@Table(name = "learner_profiles") 
@Data
public class LearnerProfile {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "current_level_code") 
    private String currentLevelCode;

    @Column(name = "daily_learning_goal_minutes") 
    private Integer dailyLearningGoalMinutes;
    
    // --- PHẦN BỔ SUNG ĐỂ SỬA LỖI ---
    @Column(name = "assessment_score")
    private Double assessmentScore; // Điểm đánh giá (có trong DB)
    
    @Column(name = "subscription_end_date")
    private Date subscriptionEndDate; // Ngày hết hạn (có trong DB)

    // QUAN TRỌNG: Đây là biến thiếu gây ra lỗi
    @ManyToOne
    @JoinColumn(name = "current_package_id")
    private ServicePackage currentPackage;
    // -------------------------------

    @Enumerated(EnumType.STRING)
    @Column(name = "learning_mode") 
    private LearningMode learningMode;

    // Liên kết Goal
    @ManyToOne
    @JoinColumn(name = "main_goal_id")
    private LearnerGoal mainGoal;

    // Liên kết Interest
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<ProfileInterest> interests;

    public enum LearningMode { FULL_SENTENCE, KEY_PHRASE }
}