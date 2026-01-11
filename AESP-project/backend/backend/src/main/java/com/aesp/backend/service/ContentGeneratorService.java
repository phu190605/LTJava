package com.aesp.backend.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.aesp.backend.dto.request.GenerateContentRequest;
import com.aesp.backend.dto.response.GeneratedScenarioResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContentGeneratorService {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generate remedial exercise based on topic and weak points
     * Uses prompt engineering to call OpenAI/LLM
     */
    public GeneratedScenarioResponse generateRemedialExercise(GenerateContentRequest request) {
        log.info("Generating remedial exercise for topic: {} with weak points: {}", 
                request.getTopic(), request.getWeakPoints());

        // If OpenAI API key is not configured, use mock data
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            log.warn("OpenAI API key not configured, using mock scenario generation");
            return generateMockScenario(request);
        }

        try {
            // Build prompt for OpenAI
            String prompt = buildPrompt(request);
            
            // Call OpenAI API
            String aiResponse = callOpenAI(prompt);
            
            // Parse response and build scenario
            return parseAIResponse(aiResponse, request);
            
        } catch (Exception e) {
            log.error("Error calling OpenAI API, falling back to mock scenario", e);
            return generateMockScenario(request);
        }
    }

    /**
     * Build prompt for OpenAI
     */
    private String buildPrompt(GenerateContentRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Create a roleplay scenario for English learning with the following requirements:\n\n");
        prompt.append("Topic: ").append(request.getTopic()).append("\n");
        prompt.append("Difficulty Level: ").append(request.getDifficultyLevel() != null ? request.getDifficultyLevel() : "intermediate").append("\n");
        prompt.append("Weak Points to Focus On: ").append(String.join(", ", request.getWeakPoints())).append("\n\n");
        
        prompt.append("Generate a conversational scenario with:\n");
        prompt.append("1. A clear context/situation\n");
        prompt.append("2. ").append(request.getNumberOfDialogues() != null ? request.getNumberOfDialogues() : 8).append(" dialogue exchanges\n");
        prompt.append("3. Each dialogue should specifically address the weak points mentioned\n");
        prompt.append("4. Include annotations for grammar points or pronunciation tips\n");
        prompt.append("5. Highlight key phrases that learners should focus on\n\n");
        
        prompt.append("Format the response as a structured dialogue with speaker labels (e.g., Student, Manager, etc.)");
        
        return prompt.toString();
    }

    /**
     * Call OpenAI API
     */
    private String callOpenAI(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "You are an expert English language learning content creator."),
                Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("temperature", 0.7);
        requestBody.put("max_tokens", 1500);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(openaiApiUrl, entity, Map.class);
        
        if (response != null && response.containsKey("choices")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (!choices.isEmpty()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }
        }

        throw new RuntimeException("Failed to get response from OpenAI");
    }

    /**
     * Parse AI response into structured scenario
     */
    private GeneratedScenarioResponse parseAIResponse(String aiResponse, GenerateContentRequest request) {
        // Simple parsing - in production, you'd want more sophisticated parsing
        List<GeneratedScenarioResponse.DialogueLine> dialogues = new ArrayList<>();
        
        String[] lines = aiResponse.split("\n");
        for (String line : lines) {
            if (line.contains(":")) {
                String[] parts = line.split(":", 2);
                if (parts.length == 2) {
                    dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                            .speaker(parts[0].trim())
                            .text(parts[1].trim())
                            .keyPhrases(extractKeyPhrases(parts[1].trim(), request.getWeakPoints()))
                            .build());
                }
            }
        }

        return GeneratedScenarioResponse.builder()
                .title("Roleplay: " + request.getTopic())
                .context(aiResponse.substring(0, Math.min(200, aiResponse.length())))
                .topic(request.getTopic())
                .difficultyLevel(request.getDifficultyLevel())
                .dialogueLines(dialogues)
                .focusAreas(request.getWeakPoints())
                .learningObjective("Practice " + String.join(", ", request.getWeakPoints()))
                .build();
    }

    /**
     * Generate mock scenario when OpenAI is not available
     */
    private GeneratedScenarioResponse generateMockScenario(GenerateContentRequest request) {
        String topic = request.getTopic();
        List<String> weakPoints = request.getWeakPoints();
        
        List<GeneratedScenarioResponse.DialogueLine> dialogues = new ArrayList<>();
        
        // Generate contextual dialogues based on topic
        if (topic.equalsIgnoreCase("Business")) {
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Manager")
                    .text("Good morning! I'd like to discuss the project timeline. When did you start working on it?")
                    .annotation("Past Tense - 'did you start'")
                    .keyPhrases(Arrays.asList("discuss", "project timeline", "did you start"))
                    .build());
            
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Employee")
                    .text("I started working on it last Monday. We have completed the initial research phase.")
                    .annotation("Past Tense - 'started', Present Perfect - 'have completed'")
                    .keyPhrases(Arrays.asList("started working", "last Monday", "have completed", "research phase"))
                    .build());
            
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Manager")
                    .text("Excellent! Can you schedule a meeting with the stakeholders for next week?")
                    .annotation("Vocabulary: Business Meeting Terms")
                    .keyPhrases(Arrays.asList("schedule a meeting", "stakeholders", "next week"))
                    .build());
            
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Employee")
                    .text("Of course! I'll send out the meeting invitations this afternoon and prepare the agenda.")
                    .annotation("Future with 'will' + Vocabulary: Meeting-related")
                    .keyPhrases(Arrays.asList("send out", "meeting invitations", "prepare the agenda"))
                    .build());
        } else {
            // Generic scenario for other topics
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Person A")
                    .text("Hello! How have you been lately?")
                    .annotation("Present Perfect - 'have been'")
                    .keyPhrases(Arrays.asList("How have you been", "lately"))
                    .build());
            
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Person B")
                    .text("I've been great! I started a new hobby last month.")
                    .annotation("Present Perfect + Past Tense")
                    .keyPhrases(Arrays.asList("I've been", "started a new hobby", "last month"))
                    .build());
            
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Person A")
                    .text("That's wonderful! What kind of hobby did you choose?")
                    .annotation("Past Tense question - 'did you choose'")
                    .keyPhrases(Arrays.asList("That's wonderful", "what kind of", "did you choose"))
                    .build());
            
            dialogues.add(GeneratedScenarioResponse.DialogueLine.builder()
                    .speaker("Person B")
                    .text("I've taken up photography. I've already learned so much about composition.")
                    .annotation("Present Perfect - 'have taken up', 'have learned'")
                    .keyPhrases(Arrays.asList("taken up", "photography", "learned so much", "composition"))
                    .build());
        }
        
        return GeneratedScenarioResponse.builder()
                .title("Practice Scenario: " + topic)
                .context("This scenario focuses on improving your " + String.join(" and ", weakPoints) + 
                        " in a " + topic.toLowerCase() + " context.")
                .topic(topic)
                .difficultyLevel(request.getDifficultyLevel() != null ? request.getDifficultyLevel() : "intermediate")
                .dialogueLines(dialogues)
                .focusAreas(weakPoints)
                .learningObjective("Master " + String.join(", ", weakPoints) + " through practical conversation")
                .build();
    }

    /**
     * Extract key phrases from text based on weak points
     */
    private List<String> extractKeyPhrases(String text, List<String> weakPoints) {
        List<String> phrases = new ArrayList<>();
        
        // Simple extraction - look for words related to weak points
        for (String weakPoint : weakPoints) {
            if (text.toLowerCase().contains(weakPoint.toLowerCase())) {
                // Extract surrounding context
                String lowerText = text.toLowerCase();
                int index = lowerText.indexOf(weakPoint.toLowerCase());
                int start = Math.max(0, index - 10);
                int end = Math.min(text.length(), index + weakPoint.length() + 10);
                phrases.add(text.substring(start, end).trim());
            }
        }
        
        return phrases.isEmpty() ? Arrays.asList(text.substring(0, Math.min(30, text.length()))) : phrases;
    }
}
