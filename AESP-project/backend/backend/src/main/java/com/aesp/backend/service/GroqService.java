package com.aesp.backend.service;

import java.util.ArrayList;
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
public class GroqService implements IAIService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // --- ĐỊNH NGHĨA TÍNH CÁCH (PERSONA) CỦA AI ---
    private final String SYSTEM_PROMPT = 
        "You are AESP (AI English Speaking Partner), a friendly English tutor. " +
        "Your goal is to help the user practice speaking English. " +
        "Rules: " +
        "1. Keep your responses concise (under 40 words) for natural conversation. " +
        "2. If the user makes a grammar mistake, gently correct it at the end of your response. " +
        "3. Ask follow-up questions to keep the conversation going. " +
        "4. Be encouraging and patient.";

    @Override
    public String getServiceName() {
        return "Groq Cloud (English Tutor)";
    }

    @Override
    public String chatWithAI(String message) {
        if (apiKey == null || apiKey.contains("Thay_Key")) {
            System.err.println("❌ Lỗi: Chưa cấu hình Groq Key");
            return null;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        // Sử dụng Model mới nhất
        requestBody.put("model", "llama-3.3-70b-versatile"); 
        
        List<Map<String, String>> messages = new ArrayList<>();

        // --- BƯỚC 1: THÊM SYSTEM MESSAGE (QUAN TRỌNG) ---
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", SYSTEM_PROMPT);
        messages.add(systemMsg);

        // --- BƯỚC 2: THÊM USER MESSAGE ---
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", message);
        messages.add(userMsg);
        
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.7); // Độ sáng tạo vừa phải

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> msgObj = (Map<String, Object>) choices.get(0).get("message");
                    return (String) msgObj.get("content");
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Groq API Lỗi: " + e.getMessage());
        }
        return null;
    }
}