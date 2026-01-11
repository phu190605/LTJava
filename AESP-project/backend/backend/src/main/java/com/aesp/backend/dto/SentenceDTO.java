package com.aesp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SentenceDTO {
    private String sentence;
    private String vietnameseMeaning;
    private String level;
    private String topic;
    private String source; // "DB" hoặc "AI"
}