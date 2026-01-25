package com.aesp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aesp.backend.dto.response.AssessmentResult;
import com.aesp.backend.service.SpeechService;

@RestController
@RequestMapping("/api/speech")
@CrossOrigin(origins = {  "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173" }, allowCredentials = "true")
public class SpeechController {

    @Autowired
    private SpeechService speechService;

    @PostMapping(value = "/assess", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> assessPronunciation(
            @RequestParam("file") MultipartFile file,
            @RequestParam("text") String referenceText,
            @RequestParam("userId") Long userId,
            @RequestParam("partNumber") int partNumber) {
        try {
            AssessmentResult result = speechService.analyzePronunciation(file, referenceText, userId, partNumber);
            return ResponseEntity.ok(result);
        } catch (Exception e) { // Catch only Exception, not Throwable
            // Log error to server console
            System.err.println("[ERROR] Pronunciation assessment failed:");
            e.printStackTrace();
            // Return detailed error to frontend (for debugging, remove in production)
            return ResponseEntity.status(500)
                    .body("Error: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // Endpoint: Convert speech to text
    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> transcribeAudio(@RequestParam("file") MultipartFile file) {
        try {
            String text = speechService.transcribe(file.getBytes());
            return ResponseEntity.ok(text);
        } catch (Exception e) {
            System.err.println("[ERROR] Audio transcription failed:");
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}