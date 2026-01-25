package com.aesp.backend.service;

import com.aesp.backend.dto.response.AssessmentResult;
import org.springframework.web.multipart.MultipartFile;

public interface SpeechService {
    AssessmentResult analyzePronunciation(MultipartFile file, String referenceText, Long userId, int partNumber)
            throws Exception;

    String transcribe(byte[] audioBytes) throws Exception;
}