package com.aesp.backend.service;

import com.aesp.backend.dto.response.AssessmentResult;
import org.springframework.web.multipart.MultipartFile;

public interface AIService {
    AssessmentResult analyzeAssessment(MultipartFile audioFile, String referenceText);
}
