package com.aesp.backend.service;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service

public class OpenAIService {
    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);
    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/completions}")
    private String apiUrl;

    @Value("${openai.api.model:gpt-3.5-turbo-instruct}")
    private String model;

    public String generateSentence(String topic, String level) {
        try {
            logger.info("[OpenAIService] Gọi OpenAI với model: {} | url: {}", model, apiUrl);
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("prompt", "Hãy tạo một câu tiếng Anh về chủ đề: '" + topic + "' với độ khó: '" + level + "'.");
            body.put("max_tokens", 60);
            body.put("temperature", 0.7);

            logger.info("[OpenAIService] Request body: {}", body);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

            logger.info("[OpenAIService] Response status: {}", response.getStatusCode());
            logger.info("[OpenAIService] Response body: {}", response.getBody());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object choicesObj = response.getBody().get("choices");
                if (choicesObj instanceof java.util.List && !((java.util.List) choicesObj).isEmpty()) {
                    Map first = (Map) ((java.util.List) choicesObj).get(0);
                    Object text = first.get("text");
                    if (text != null) return text.toString().trim();
                }
            }
            logger.warn("[OpenAIService] Không nhận được nội dung hợp lệ từ OpenAI.");
            return "Xin lỗi, OpenAI không trả về nội dung hợp lệ.";
        } catch (Exception e) {
            logger.error("[OpenAIService] Lỗi khi gọi OpenAI: {}", e.getMessage(), e);
            return "Xin lỗi, OpenAI đang bận hoặc lỗi.";
        }
    }
}
