
package com.aesp.backend.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data; 

@Data
public class SpeechAnalysisRequest {

    // File âm thanh người dùng ghi âm
    private MultipartFile file;

    // Câu văn bản mẫu mà người dùng cần đọc (để AI so sánh)
    private String referenceText;

    // Constructor mặc định
    public SpeechAnalysisRequest() {
    }

    // Constructor đầy đủ
    public SpeechAnalysisRequest(MultipartFile file, String referenceText) {
        this.file = file;
        this.referenceText = referenceText;
    }

    // --- Getters và Setters ---

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public String getReferenceText() {
        return referenceText;
    }

    public void setReferenceText(String referenceText) {
        this.referenceText = referenceText;
    }
}