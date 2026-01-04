package com.aesp.backend.dto.response;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AIAnalysisResponse {
    private String transcript;
    private int pronunciationScore;
    private String aiFeedback; // Phản hồi của trợ lý ảo
    private List<String> errors; // Danh sách lỗi ngữ pháp/phát âm
    private Suggestion nextSuggestion; // Gợi ý thích ứng

    @Data
    @Builder
    public static class Suggestion {
        private String type; // "FULL_SENTENCE" hoặc "KEYWORDS"
        private List<String> content;
    }
}