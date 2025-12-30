package com.aesp.backend.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity @Table(name = "learner_goals") @Data
public class LearnerGoal {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Integer goalId;
    
    @Column(name = "goal_name") private String goalName;
    @Column(name = "goal_code") private String goalCode;
    private String description;
    @Column(name = "icon_url") private String iconUrl;
}