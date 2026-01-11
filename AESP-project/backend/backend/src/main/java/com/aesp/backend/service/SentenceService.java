package com.aesp.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aesp.backend.dto.SentenceDTO;
import com.aesp.backend.entity.Sentence;
import com.aesp.backend.entity.Topic;
import com.aesp.backend.repository.SentenceRepository;
import com.aesp.backend.repository.TopicRepository;

@Service
public class SentenceService {

    @Autowired
    private SentenceRepository sentenceRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private GeminiService geminiService; // Service gọi AI của bạn

    public SentenceDTO getPracticeSentence(String topicName, String level, boolean forceAI) {
        // 1. ƯU TIÊN 1: Tìm trong Database trước (nếu không ép buộc dùng AI)
        if (!forceAI) {
            Optional<Sentence> dbSentence = sentenceRepository.findRandomSentence(topicName, level);
            if (dbSentence.isPresent()) {
                Sentence s = dbSentence.get();
                System.out.println("✅ Found sentence in DB: " + s.getContent());
                return new SentenceDTO(
                        s.getContent(),
                        s.getVietnameseMeaning(),
                        s.getLevel(),
                        s.getTopic().getName(),
                        "DB"
                );
            }
        }

        // 2. ƯU TIÊN 2: Nếu DB không có, gọi AI sinh câu mới
        System.out.println("⚠️ DB miss or forceAI=true. Calling Gemini...");
        
        // Gọi AI (Giả sử hàm chatWithAI trả về String JSON hoặc text)
        // Lưu ý: Bạn cần parse kết quả từ AI để tách tiếng Anh và tiếng Việt nếu muốn lưu kỹ
        // Ở đây mình làm đơn giản là lấy text AI trả về làm content.
        String aiResponse = "";
        try {
            boolean invoked = false;
            java.lang.reflect.Method[] methods = geminiService.getClass().getMethods();
            for (java.lang.reflect.Method m : methods) {
                String name = m.getName();
                if (!"generateSentence".equals(name) && !"chatWithAI".equals(name) && !"chat".equals(name) && !"generate".equals(name)) {
                    continue;
                }
                Class<?>[] pts = m.getParameterTypes();
                try {
                    Object result;
                    if (pts.length == 2) {
                        result = m.invoke(geminiService, topicName, level);
                    } else if (pts.length == 1) {
                        result = m.invoke(geminiService, topicName + " | level:" + level);
                    } else if (pts.length == 0) {
                        result = m.invoke(geminiService);
                    } else {
                        continue;
                    }
                    aiResponse = result != null ? result.toString() : "";
                    invoked = true;
                    break;
                } catch (Exception e) {
                    // try next candidate
                }
            }
            if (!invoked) {
                System.err.println("❌ GeminiService does not expose a compatible AI method; using empty response.");
                aiResponse = "";
            }
        } catch (Exception e) {
            System.err.println("❌ Error invoking AI method: " + e.getMessage());
            aiResponse = "";
        }
        
        // 3. LƯU CÂU MỚI VÀO DB ĐỂ DÙNG CHO LẦN SAU
        saveToDatabase(topicName, level, aiResponse);

        return new SentenceDTO(aiResponse, "", level, topicName, "AI");
    }

    private void saveToDatabase(String topicName, String level, String content) {
        try {
            // Tìm Topic trong DB, nếu chưa có thì tạo mới (hoặc bỏ qua)
            Topic topic = topicRepository.findByName(topicName)
                    .orElseGet(() -> {
                        Topic newTopic = new Topic();
                        newTopic.setName(topicName);
                        return topicRepository.save(newTopic);
                    });

            Sentence newSentence = new Sentence();
            newSentence.setContent(content);
            newSentence.setLevel(level);
            newSentence.setTopic(topic);
            newSentence.setSource("AI_GENERATED");
            
            sentenceRepository.save(newSentence);
            System.out.println("💾 Saved new AI sentence to DB.");
        } catch (Exception e) {
            System.err.println("❌ Failed to save to DB: " + e.getMessage());
        }
    }
}