package com.aesp.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AssessmentSubmitDTO {

    @NotBlank(message = "Assessment ID is required")
    private String assessmentId;

    @NotBlank(message = "Final level is required")
    private String finalLevel;

    private String mentorComment;


    public String getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(String assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getFinalLevel() {
        return finalLevel;
    }

    public void setFinalLevel(String finalLevel) {
        this.finalLevel = finalLevel;
    }

    public String getMentorComment() {
        return mentorComment;
    }

    public void setMentorComment(String mentorComment) {
        this.mentorComment = mentorComment;
    }
}
