package com.aesp.backend.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aesp.backend.dto.SentenceDTO;
import com.aesp.backend.entity.Sentence;
import com.aesp.backend.entity.Topic;
import com.aesp.backend.repository.SentenceRepository;
import com.aesp.backend.repository.TopicRepository;

@Service

public class SentenceService {
    private final SentenceRepository sentenceRepository;
    private final TopicRepository topicRepository;
    private final AIServiceManager aiServiceManager;

    private static final Logger logger = LoggerFactory.getLogger(SentenceService.class);

    public SentenceService(SentenceRepository sentenceRepository, TopicRepository topicRepository, AIServiceManager aiServiceManager) {
        this.sentenceRepository = sentenceRepository;
        this.topicRepository = topicRepository;
        this.aiServiceManager = aiServiceManager;
    }

    public SentenceDTO getPracticeSentence(String topicName, String level, boolean forceAI) {
        // 1. ƯU TIÊN 1: Tìm trong Database trước (nếu không ép buộc dùng AI)
        if (!forceAI) {
            Optional<Sentence> dbSentence = sentenceRepository.findRandomSentence(topicName, level);
            if (dbSentence.isPresent()) {
                Sentence s = dbSentence.get();
                logger.info("Found sentence in DB: {}", s.getContent());
                return new SentenceDTO(
                        s.getContent(),
                        s.getVietnameseMeaning(),
                        s.getLevel(),
                        s.getTopic().getTopicName(),
                        "DB"
                );
            }
        }

        // 2. ƯU TIÊN 2: Nếu DB không có, gọi AI sinh câu mới qua AIServiceManager
        logger.warn("DB miss or forceAI=true. Calling AIServiceManager...");
        String aiResponse = aiServiceManager.generateSentence(topicName, level);
        // 3. LƯU CÂU MỚI VÀO DB ĐỂ DÙNG CHO LẦN SAU
        saveToDatabase(topicName, level, aiResponse);

        return new SentenceDTO(aiResponse, "", level, topicName, "AI");
    }

    private void saveToDatabase(String topicName, String level, String content) {
        try {
            // Tìm Topic trong DB, nếu chưa có thì tạo mới (hoặc bỏ qua)
            Topic topic = topicRepository.findByTopicName(topicName)
                    .orElseGet(() -> {
                        Topic newTopic = new Topic();
                        newTopic.setTopicName(topicName);
                        newTopic.setTopicCode(topicName.toUpperCase().replace(" ", "_"));
                        newTopic.setDescription("");
                        newTopic.setIconUrl("");
                        newTopic.setCategory("GENERAL");
                        return topicRepository.save(newTopic);
                    });

            Sentence newSentence = new Sentence();
            newSentence.setContent(content);
            newSentence.setLevel(level);
            newSentence.setTopic(topic);
            newSentence.setSource("AI_GENERATED");
            
            sentenceRepository.save(newSentence);
            logger.info("Saved new AI sentence to DB.");
        } catch (Exception e) {
            logger.error("Failed to save to DB: {}", e.getMessage());
        }
    }
}