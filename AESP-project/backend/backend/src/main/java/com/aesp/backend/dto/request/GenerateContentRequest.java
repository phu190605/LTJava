package com.aesp.backend.dto.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateContentRequest {
    private String topic;
    private List<String> weakPoints;
    private String difficultyLevel; // beginner, intermediate, advanced
    private Integer numberOfDialogues;
}
