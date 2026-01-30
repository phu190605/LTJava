package com.aesp.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aesp.backend.dto.response.SpeakingResponseDTO;
import com.aesp.backend.dto.response.SpeakingResultDTO;
import com.aesp.backend.entity.SpeakingResult;
import com.aesp.backend.repository.SpeakingResultRepository;
import com.aesp.backend.service.SpeakingService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/speaking")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SpeakingController {

    private final SpeakingService speakingService;
    private final SpeakingResultRepository repository;

    public SpeakingController(SpeakingService speakingService,
            SpeakingResultRepository repository) {
        this.speakingService = speakingService;
        this.repository = repository;
    }

    @PostMapping
    public SpeakingResponseDTO submitSpeaking(
            @RequestParam("audio") MultipartFile audio,
            @RequestParam("userId") Long userId,
            @RequestParam("partNumber") int partNumber) {
        try {
            // 1. Tính điểm từ file âm thanh
            int score = speakingService.calculateScore(audio);
            String feedback = speakingService.generateFeedback(score);

            // 2. Lưu file audio vào thư mục resources/audio
            String audioDir = "src/main/resources/audio/";
            String fileName = "user_" + userId + "_part_" + partNumber + "_" + System.currentTimeMillis() + ".wav";
            java.io.File dest = new java.io.File(audioDir + fileName);
            dest.getParentFile().mkdirs();
            audio.transferTo(dest);
            String audioPath = "/api/speaking/audio/" + fileName;

            // 3. Tìm kiếm kết quả cũ để ghi đè (Update) thay vì tạo mới (Insert)
                SpeakingResult result = repository.findTopByUserIdAndPartNumberOrderByIdDesc(userId, partNumber)
                    .orElse(new SpeakingResult());

            result.setUserId(userId);
            result.setPartNumber(partNumber);
            result.setScore(score);
            result.setFeedback(feedback);
            result.setAudioPath(audioPath);

            // 4. Lưu vào database (Ghi đè dựa trên ID nếu đã tồn tại)
            repository.save(result);

            return new SpeakingResponseDTO(score, feedback);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu file audio: " + e.getMessage());
        }
    }

    // GET endpoint to fetch all speaking results for a user (returns DTO with
    // audioUrl)
    @GetMapping("/results")
    public List<SpeakingResultDTO> getSpeakingResults(@RequestParam("userId") Long userId) {
        List<SpeakingResult> results = repository.findAllByUserIdOrderByPartNumberAsc(userId);
        return results.stream().map(result -> new SpeakingResultDTO(
                result.getId(),
                result.getUserId(),
                result.getPartNumber(),
                result.getScore(),
                result.getFeedback(),
                result.getAudioPath(), // mapped as audioUrl
                result.getReferenceText(),
                result.getCreatedAt())).toList();
    }

    // Serve audio files
    @GetMapping("/audio/{fileName}")
    public org.springframework.core.io.Resource getAudioFile(
            @org.springframework.web.bind.annotation.PathVariable String fileName) throws java.io.IOException {
        java.nio.file.Path path = java.nio.file.Paths.get("src/main/resources/audio/" + fileName);
        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(path.toUri());
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new java.io.FileNotFoundException("Không tìm thấy file audio");
        }
    }

    @PostMapping("/results")
    public ResponseEntity<?> saveSpeakingResult(@RequestBody SpeakingResult result) {
        // Ensure referenceText is set if missing (for safety, but should come from frontend)
        if (result.getReferenceText() == null || result.getReferenceText().isEmpty()) {
            // Optionally, set a default or log a warning
        }
        repository.save(result);
        return ResponseEntity.ok().build();
    }
}
