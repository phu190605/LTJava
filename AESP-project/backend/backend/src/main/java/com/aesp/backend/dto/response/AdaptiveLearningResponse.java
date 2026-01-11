package com.aesp.backend.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdaptiveLearningResponse {
    private String message;
    private List<RecommendedLesson> recommendedLessons;
    private List<String> weakAreasIdentified;
    private String learningPathAdjusted;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedLesson {
        private String lessonId;
        private String title;
        private String focusArea;
        private String description;
        private Integer priority;
    }
}
