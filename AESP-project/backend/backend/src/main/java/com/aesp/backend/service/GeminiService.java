package com.aesp.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    // Hàm này thay thế cho việc gọi Azure OpenAI
    public String chatWithAI(String userMessage) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String finalUrl = apiUrl + apiKey;

            // 1. Tạo Header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 2. Tạo Body (Cấu trúc JSON mà Google yêu cầu)
            // Prompt mẫu: Đóng vai giáo viên tiếng Anh
            String systemPrompt = "Bạn là trợ lý ảo AESP giúp luyện tiếng Anh. Hãy trả lời ngắn gọn, sửa lỗi ngữ pháp nếu có.";
            String fullMessage = systemPrompt + "\nNgười dùng nói: " + userMessage;

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", fullMessage);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", List.of(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(parts));

            // 3. Gửi Request
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);

            // 4. Lấy kết quả text trả về
            Map body = response.getBody();
            List<Map> candidates = (List<Map>) body.get("candidates");
            Map content = (Map) candidates.get(0).get("content");
            List<Map> partsResponse = (List<Map>) content.get("parts");
            
            return (String) partsResponse.get(0).get("text");

        } catch (Exception e) {
            e.printStackTrace();
            return "Xin lỗi, AI đang bận. Lỗi: " + e.getMessage();
        }
    }
}