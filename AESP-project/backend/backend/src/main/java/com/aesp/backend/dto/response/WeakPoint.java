package com.aesp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeakPoint {
    private String type; // "phoneme", "grammar", "vocabulary"
    private String identifier;
    private Double score;
}
