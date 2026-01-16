package com.aesp.backend.controller;

import com.aesp.backend.dto.request.respone.SpeakingResponseDTO;
import com.aesp.backend.entity.SpeakingResult;
import com.aesp.backend.repository.SpeakingResultRepository;
import com.aesp.backend.service.SpeakingService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            @RequestParam("UserId") Long UserId,
            @RequestParam("partNumber") int partNumber
    ) {
        // 1. Tính điểm từ file âm thanh
        int score = speakingService.calculateScore(audio);
        String feedback = speakingService.generateFeedback(score);

        // 2. Tìm kiếm kết quả cũ để ghi đè (Update) thay vì tạo mới (Insert)
        SpeakingResult result = repository.findByUserIdAndPartNumber(UserId, partNumber)
                .orElse(new SpeakingResult());

        result.setUserId(UserId);
        result.setPartNumber(partNumber);
        result.setScore(score);
        result.setFeedback(feedback);

        // 3. Lưu vào database (Ghi đè dựa trên ID nếu đã tồn tại)
        repository.save(result);

        return new SpeakingResponseDTO(score, feedback);
    }
}
