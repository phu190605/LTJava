package com.aesp.backend.service.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List; // Vẫn import để sau này dùng lại

import org.springframework.beans.factory.annotation.Autowired; // Vẫn import để sau này dùng lại
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aesp.backend.config.AzureConfig;
import com.aesp.backend.dto.response.AssessmentResult;
import com.aesp.backend.dto.response.WordResult;
import com.aesp.backend.repository.SpeechAssessmentRepository;
import com.aesp.backend.service.SpeechService;
import com.cloudinary.Cloudinary;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.cognitiveservices.speech.PronunciationAssessmentConfig;
import com.microsoft.cognitiveservices.speech.PronunciationAssessmentGradingSystem;
import com.microsoft.cognitiveservices.speech.PronunciationAssessmentGranularity;
import com.microsoft.cognitiveservices.speech.PronunciationAssessmentResult;
import com.microsoft.cognitiveservices.speech.PropertyId;
import com.microsoft.cognitiveservices.speech.ResultReason;
import com.microsoft.cognitiveservices.speech.SpeechConfig;
import com.microsoft.cognitiveservices.speech.SpeechRecognitionResult;
import com.microsoft.cognitiveservices.speech.SpeechRecognizer;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;

@Service
public class SpeechServiceImpl implements SpeechService {

    @Autowired
    private AzureConfig azureConfig;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private SpeechAssessmentRepository assessmentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public AssessmentResult analyzePronunciation(MultipartFile file, String referenceText) throws Exception {
        File tempFile = File.createTempFile("upload_", ".wav");
        SpeechRecognizer recognizer = null;
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());

            // Azure Speech config
            SpeechConfig speechConfig = SpeechConfig.fromSubscription(azureConfig.getSpeechKey(),
                    azureConfig.getSpeechRegion());
            speechConfig.setSpeechRecognitionLanguage("en-US");

            AudioConfig audioConfig = AudioConfig.fromWavFileInput(tempFile.getAbsolutePath());

            PronunciationAssessmentConfig pronunciationConfig = new PronunciationAssessmentConfig(
                    referenceText,
                    PronunciationAssessmentGradingSystem.HundredMark,
                    PronunciationAssessmentGranularity.Phoneme,
                    true);

            recognizer = new SpeechRecognizer(speechConfig, audioConfig);
            pronunciationConfig.applyTo(recognizer);

            // Call Azure AI and get result
            SpeechRecognitionResult result = recognizer.recognizeOnceAsync().get();
            PronunciationAssessmentResult pronResult = PronunciationAssessmentResult.fromResult(result);

            // Parse result for frontend
            List<WordResult> wordResultsDTO = new ArrayList<>();
            String jsonResult = result.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult);
            System.out.println("[DEBUG] Azure jsonResult: " + jsonResult); // Log raw Azure response
            if (jsonResult != null) {
                JsonNode root = objectMapper.readTree(jsonResult);
                JsonNode nBestNode = root.path("NBest");
                if (nBestNode.isArray() && nBestNode.size() > 0) {
                    JsonNode wordsNode = nBestNode.get(0).path("Words");
                    if (wordsNode.isArray()) {
                        for (JsonNode wordNode : wordsNode) {
                            String wordText = wordNode.path("Word").asText();
                            double accuracy = wordNode.path("PronunciationAssessment").path("AccuracyScore").asDouble();
                            String errorType = wordNode.path("PronunciationAssessment").path("ErrorType").asText();
                            wordResultsDTO.add(new WordResult(wordText, accuracy, errorType));
                        }
                    } else {
                        System.err.println("[ERROR] 'Words' node is not an array or missing in Azure response.");
                    }
                } else {
                    System.err.println("[ERROR] 'NBest' node is not an array or empty in Azure response.");
                }
            } else {
                System.err.println("[ERROR] jsonResult from Azure is null.");
            }

            // --- Lưu kết quả đánh giá vào DB để sau này truy vấn lịch sử ---
            com.aesp.backend.entity.SpeechAssessment assessmentEntity = new com.aesp.backend.entity.SpeechAssessment();
            // Nếu có userId từ context thì set vào sau này; hiện để null
            assessmentEntity.setUserId(null);
            assessmentEntity.setReferenceText(referenceText);
            assessmentEntity.setAudioUrl(null);
            assessmentEntity.setAccuracyScore(pronResult.getAccuracyScore());
            assessmentEntity.setFluencyScore(pronResult.getFluencyScore());
            assessmentEntity.setCompletenessScore(pronResult.getCompletenessScore());
            assessmentEntity.setProsodyScore(0.0);
            assessmentEntity.setOverallScore(pronResult.getPronunciationScore());

            // Chuyển WordResult -> WordDetail và liên kết
            List<com.aesp.backend.entity.WordDetail> wordDetails = new ArrayList<>();
            for (com.aesp.backend.dto.response.WordResult wr : wordResultsDTO) {
                com.aesp.backend.entity.WordDetail wd = new com.aesp.backend.entity.WordDetail();
                wd.setSpeechAssessment(assessmentEntity);
                wd.setWord(wr.getWord());
                wd.setAccuracyScore(wr.getAccuracyScore());
                wd.setErrorType(wr.getErrorType());
                wordDetails.add(wd);
            }
            assessmentEntity.setWordDetails(wordDetails);

            // Save (cascade will persist WordDetail)
            assessmentRepository.save(assessmentEntity);

            return new AssessmentResult(
                    determineLevel(pronResult.getPronunciationScore()),
                    pronResult.getPronunciationScore(),
                    generateFeedback(pronResult.getPronunciationScore()),
                    pronResult.getAccuracyScore(),
                    pronResult.getFluencyScore(),
                    pronResult.getCompletenessScore(),
                    0.0,
                    wordResultsDTO);
        } catch (Exception e) {
            // Log error and rethrow for controller to handle
            System.err.println("[ERROR] Pronunciation analysis failed:");
            e.printStackTrace();
            throw e;
        } finally {
            if (recognizer != null) {
                recognizer.close();
            }
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    // --- CÁC HÀM PHỤ TRỢ ---

    private String determineLevel(double score) {
        if (score >= 90)
            return "Advanced";
        if (score >= 70)
            return "Intermediate";
        return "Beginner";
    }

    private String generateFeedback(double score) {
        if (score >= 80)
            return "Tuyệt vời! Bạn phát âm rất giống người bản xứ.";
        if (score >= 60)
            return "Khá tốt, nhưng hãy chú ý nhấn âm rõ hơn nhé.";
        return "Cần cố gắng thêm. Hãy nghe lại audio mẫu và tập chậm lại.";
    }

    @Override
    public String transcribe(byte[] audioBytes) throws Exception {
        File tempFile = File.createTempFile("audio_transcribe", ".wav");
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(audioBytes);
        }

        SpeechConfig speechConfig = SpeechConfig.fromSubscription(azureConfig.getSpeechKey(),
                azureConfig.getSpeechRegion());
        speechConfig.setSpeechRecognitionLanguage("en-US");
        AudioConfig audioConfig = AudioConfig.fromWavFileInput(tempFile.getAbsolutePath());
        SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);

        SpeechRecognitionResult result = recognizer.recognizeOnceAsync().get();

        recognizer.close();
        tempFile.delete();

        if (result.getReason() == ResultReason.RecognizedSpeech) {
            return result.getText();
        } else {
            throw new RuntimeException("Speech recognition failed: " + result.getReason());
        }
    }
}