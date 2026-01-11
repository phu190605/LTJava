package com.aesp.backend.peer.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class TopicSuggestionService {

    private static final List<String> TOPICS = List.of(
            "Introduce yourself",
            "Your daily routine",
            "Your dream job",
            "Travel experience",
            "Business idea"
    );

    public String randomTopic() {
        return TOPICS.get(new Random().nextInt(TOPICS.size()));
    }
}
