package com.aesp.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class AIServiceManager {
    // Danh sách chứa các AI tuân thủ Interface IAIService
    private final List<IAIService> aiServices = new ArrayList<>();
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    // Inject Groq và Gemini (Lưu ý: Bỏ OpenAI nếu bạn chưa code xong)
    public AIServiceManager(GroqService groqService, GeminiService geminiService) {
        // THỨ TỰ QUAN TRỌNG:
        // 1. Groq (Free, Nhanh) -> Gọi trước
        aiServices.add(groqService);
        
        // 2. Gemini (Backup) -> Gọi sau
        aiServices.add(geminiService);
    }

    public String chatWithAI(String message) {
        for (IAIService service : aiServices) {
            System.out.println("🔄 Đang thử gọi: " + service.getServiceName());
            
            // Gọi trực tiếp (Không dùng Reflection nữa -> Tránh lỗi ngớ ngẩn)
            String result = service.chatWithAI(message);

            if (result != null && !result.trim().isEmpty()) {
                String lower = result.toLowerCase();
                // Kiểm tra xem kết quả có phải là thông báo lỗi không
                if (!lower.contains("quota") && !lower.contains("rate limit") && !lower.contains("error")) {
                    System.out.println("✅ Thành công với: " + service.getServiceName());
                    return result;
                }
            }
            System.out.println("❌ Thất bại với: " + service.getServiceName() + ". Đang chuyển AI tiếp theo...");
        }
        return "Xin lỗi, hiện tại tất cả hệ thống AI (Groq, Gemini) đều đang bận. Vui lòng thử lại sau.";
    }

    public String generateSentence(String topic, String level) {
        String cacheKey = topic + "|" + level;
        if (cache.containsKey(cacheKey)) return cache.get(cacheKey);

        String prompt = "Create one English sentence about " + topic + " for " + level + " level.";
        String result = chatWithAI(prompt);
        
        if (!result.startsWith("Xin lỗi")) {
            cache.put(cacheKey, result);
        }
        return result;
    }
}