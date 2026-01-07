package com.aesp.backend.service;

import java.util.HashMap;
import java.util.List;
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

import jakarta.annotation.PostConstruct;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    // Cached endpoint assembled after discovery, includes ?key=
    private String discoveredEndpoint = null;

    @PostConstruct
    public void discoverModel() {
        try {
            org.springframework.http.client.SimpleClientHttpRequestFactory requestFactory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
            requestFactory.setConnectTimeout(5000);
            requestFactory.setReadTimeout(5000);
            RestTemplate restTemplate = new RestTemplate(requestFactory);

            // Use a helper that prefers models which advertise support for generateContent
            String chosen = pickBestModelSupportingGenerate(restTemplate);

            if (chosen != null) {
                discoveredEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + chosen + ":generateContent?key=" + apiKey;
                logger.info("[GeminiService] Auto-selected model '{}' -> endpoint set.", chosen);
            } else {
                logger.warn("[GeminiService] No suitable model found from list, using configured apiUrl.");
                discoveredEndpoint = apiUrl + apiKey;
            }
        } catch (Exception ex) {
            logger.warn("[GeminiService] Model discovery failed: {}. Using configured apiUrl.", ex.getMessage());
            discoveredEndpoint = apiUrl + apiKey;
        }
    }

    // Pick the best model from ListModels that supports generateContent (robust key checking)
    private String pickBestModelSupportingGenerate(RestTemplate restTemplate) {
        String listUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey;
        ResponseEntity<Map> listResp = restTemplate.getForEntity(listUrl, Map.class);
        if (!listResp.getStatusCode().is2xxSuccessful() || listResp.getBody() == null) {
            return null;
        }
        Object modelsObj = listResp.getBody().get("models");
        if (!(modelsObj instanceof List)) return null;

        List models = (List) modelsObj;
        String fallbackWithSupport = null;
        String genericFallback = null;

        for (Object mo : models) {
            if (!(mo instanceof Map)) continue;
            Map modelMap = (Map) mo;
            String name = (String) modelMap.get("name");
            if (name == null) continue;
            String shortName = name.contains("/") ? name.substring(name.indexOf('/') + 1) : name;

            boolean supportsGenerate = modelSupportsGenerateContent(modelMap);
            if (supportsGenerate) {
                // prefer gemini*, then bison*, else first supporting
                if (shortName.toLowerCase().contains("gemini")) return shortName;
                if (shortName.toLowerCase().contains("bison") && fallbackWithSupport == null) fallbackWithSupport = shortName;
                if (fallbackWithSupport == null) fallbackWithSupport = shortName;
            }

            if (genericFallback == null) genericFallback = shortName;
        }

        return (fallbackWithSupport != null) ? fallbackWithSupport : genericFallback;
    }

    private boolean modelSupportsGenerateContent(Map modelMap) {
        // Look for any key containing 'method' or 'support' or 'capab' and inspect its value
        for (Object entryObj : modelMap.entrySet()) {
            Map.Entry entry = (Map.Entry) entryObj;
            String key = ((String) entry.getKey()).toLowerCase();
            Object val = entry.getValue();
            if (!(key.contains("method") || key.contains("support") || key.contains("capab"))) continue;

            if (val instanceof List) {
                for (Object it : (List) val) {
                    if (it instanceof String) {
                        String s = ((String) it).toLowerCase();
                        if (s.contains("generatecontent") || s.contains("generate") || s.contains("text") ) return true;
                    } else if (it instanceof Map) {
                        Object name = ((Map) it).get("name");
                        if (name instanceof String) {
                            String s = ((String) name).toLowerCase();
                            if (s.contains("generatecontent") || s.contains("generate") || s.contains("text")) return true;
                        }
                    }
                }
            } else if (val instanceof String) {
                String s = ((String) val).toLowerCase();
                if (s.contains("generatecontent") || s.contains("generate") || s.contains("text")) return true;
            }
        }
        return false;
    }

    public String chatWithAI(String userMessage) {
        // 1. Kiểm tra xem Key có đọc được không (Nhìn vào Terminal khi chạy)
        logger.debug("DEBUG - Gemini endpoint (effective): {}", (discoveredEndpoint != null ? discoveredEndpoint : apiUrl + apiKey));

        // Configure RestTemplate
        org.springframework.http.client.SimpleClientHttpRequestFactory requestFactory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(10000);
        RestTemplate restTemplate = new RestTemplate(requestFactory);

        String systemPrompt = "Bạn là trợ lý ảo AESP giúp luyện tiếng Anh. Hãy trả lời ngắn gọn, sửa lỗi ngữ pháp nếu có.";
        String fullMessage = systemPrompt + "\nNgười dùng nói: " + userMessage;

        // Tạo Body JSON
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", fullMessage);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        int maxRetries = 3;
        long backoff = 500L;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                String finalUrl = (discoveredEndpoint != null) ? discoveredEndpoint : apiUrl + apiKey;
                ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map body = response.getBody();
                    List<Map> candidates = (List<Map>) body.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map content = (Map) candidates.get(0).get("content");
                        List<Map> partsResponse = (List<Map>) content.get("parts");
                        if (partsResponse != null && !partsResponse.isEmpty()) {
                            return (String) partsResponse.get(0).get("text");
                        }
                    }
                    return "Xin lỗi, AI không trả về nội dung hợp lệ.";
                } else {
                    logger.error("[GeminiService] Non-200 response: {}", response.getStatusCode());
                }
            } catch (Exception ex) {
                logger.error("[GeminiService] Attempt {} failed: {}", attempt, ex.getMessage());
                // Nếu là NotFound (model không tồn tại) thì gọi ListModels và log gợi ý cấu hình
                if (ex instanceof org.springframework.web.client.HttpClientErrorException.NotFound) {
                    logger.warn("[GeminiService] Model returned 404 - attempting discovery refresh and retry.");
                    try {
                        String newChosen = pickBestModelSupportingGenerate(restTemplate);
                        if (newChosen != null) {
                            String newEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + newChosen + ":generateContent?key=" + apiKey;
                            if (!newEndpoint.equals(discoveredEndpoint)) {
                                discoveredEndpoint = newEndpoint;
                                logger.info("[GeminiService] Discovery refresh selected '{}' -> endpoint updated.", newChosen);
                            } else {
                                logger.info("[GeminiService] Discovery refresh found same model '{}'.", newChosen);
                            }
                        } else {
                            logger.warn("[GeminiService] Discovery refresh found no model supporting generateContent.");
                            discoveredEndpoint = apiUrl + apiKey;
                        }
                    } catch (Exception listEx) {
                        logger.warn("[GeminiService] Failed to refresh models: {}", listEx.getMessage());
                        discoveredEndpoint = apiUrl + apiKey;
                    }
                    // allow retry loop to continue (we don't immediately return here)
                }

                // In chi tiết lỗi nếu có (ví dụ 403, 400)
                ex.printStackTrace();
                
                if (attempt == maxRetries) {
                    return "Xin lỗi, AI đang bận. Vui lòng thử lại sau.";
                }
                try {
                    Thread.sleep(backoff);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                backoff *= 2;
            }
        }

        return "Xin lỗi, AI đang bận. Vui lòng thử lại sau.";
    }
}