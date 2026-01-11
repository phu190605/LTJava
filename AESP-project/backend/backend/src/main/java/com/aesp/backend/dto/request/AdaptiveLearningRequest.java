package com.aesp.backend.dto.request;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdaptiveLearningRequest {
    private Long userId;
    private Double pronunciationScore;
    private Double grammarScore;
    private Map<String, Double> phonemeScores; // phoneme -> score
    private List<String> weakGrammarTopics;
}
