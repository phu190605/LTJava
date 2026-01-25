package com.aesp.backend.controller;

import com.aesp.backend.dto.request.FillResultDTO;
import com.aesp.backend.entity.FillResult;
import com.aesp.backend.repository.FillResultRepository;
import com.aesp.backend.dto.response.FillResultWithQuestionDTO;
import com.aesp.backend.service.FillResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fill-results")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000",
        "http://127.0.0.1:5173" }, allowCredentials = "true")
public class FillResultController {
    @Autowired
    private FillResultRepository fillResultRepository;

    @Autowired
    private FillResultService fillResultService;

    @PostMapping
    public ResponseEntity<?> saveFillResults(@RequestBody List<FillResultDTO> results) {
        for (FillResultDTO dto : results) {
            FillResult entity = new FillResult();
            entity.setUserId(dto.getUserId());
            entity.setPartNumber(dto.getPartNumber());
            entity.setUserAnswer(dto.getUserAnswer());
            entity.setCorrect(dto.isCorrect());
            fillResultRepository.save(entity);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<FillResult> getFillResults(@RequestParam("userId") Long userId) {
        return fillResultRepository.findAllByUserIdOrderByPartNumberAsc(userId);
    }

    @GetMapping("/with-questions")
    public List<FillResultWithQuestionDTO> getFillResultsWithQuestions(@RequestParam("userId") Long userId) {
        return fillResultService.getFillResultsWithQuestions(userId);
    }
}
