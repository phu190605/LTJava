package com.aesp.backend.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService implements IAIService { // <--- Implement Interface

    @Value("${gemini.api.key}")
    private String apiKey;

private final String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=%s";
private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getServiceName() {
        return "Google Gemini";
    }

    @Override
    public String chatWithAI(String message) {
        String url = String.format(API_URL_TEMPLATE, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("text", message);
        
        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", Collections.singletonList(contentPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(parts));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> responseParts = (List<Map<String, Object>>) content.get("parts");
                    return (String) responseParts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            // Không in stack trace để đỡ rối log, chỉ in dòng lỗi
            System.err.println("⚠️ Gemini API Lỗi: " + e.getMessage()); 
        }
        return null;
    }
}