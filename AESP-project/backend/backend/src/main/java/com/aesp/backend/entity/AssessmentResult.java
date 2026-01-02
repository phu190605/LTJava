package com.aesp.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "assessment_result")
public class AssessmentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long learnerId;

    private Integer pronunciationScore;
    private Integer grammarScore;
    private Integer vocabularyScore;
    private Integer fluencyScore;
    private Integer confidenceScore;

    private String overallLevel; // BEGINNER / INTERMEDIATE / ADVANCED
}
