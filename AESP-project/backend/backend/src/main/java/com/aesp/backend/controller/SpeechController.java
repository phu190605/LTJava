package com.aesp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.aesp.backend.dto.response.AssessmentResult;
import com.aesp.backend.service.SpeechService;

@RestController
@RequestMapping("/api/speech")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class SpeechController {

    @Autowired
    private SpeechService speechService;

    // Sửa lỗi 415 bằng cách chỉ định rõ consumes Multipart Form Data
    @PostMapping(value = "/assess", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> assessPronunciation(
            @RequestParam("file") MultipartFile file,
            @RequestParam("text") String referenceText) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Dữ liệu âm thanh bị trống!");
            }

            // Gọi Service xử lý thực tế qua Azure SDK
            AssessmentResult result = speechService.analyzePronunciation(file, referenceText);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            System.err.println("[ERROR] Lỗi chấm điểm phát âm:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> transcribeAudio(@RequestParam("file") MultipartFile file) {
        try {
            String text = speechService.transcribe(file.getBytes());
            return ResponseEntity.ok(text);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi chuyển đổi: " + e.getMessage());
        }
    }
}