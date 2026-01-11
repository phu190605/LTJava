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
public class GeneratedScenarioResponse {
    private String title;
    private String context;
    private String topic;
    private String difficultyLevel;
    private List<DialogueLine> dialogueLines;
    private List<String> focusAreas;
    private String learningObjective;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DialogueLine {
        private String speaker;
        private String text;
        private String annotation; // Grammar point or pronunciation tip
        private List<String> keyPhrases;
    }
}
