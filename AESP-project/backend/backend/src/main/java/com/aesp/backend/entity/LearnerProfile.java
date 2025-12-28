package com.aesp.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "learner_profile")
public class LearnerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String goal;        // BUSINESS / TRAVEL / DAILY
    private String industry;    // IT, TOURISM...
    private Integer studyTimePerWeek;
}
