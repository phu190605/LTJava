package com.aesp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.dto.SentenceDTO;
import com.aesp.backend.service.SentenceService;

@RestController
@RequestMapping("/api/sentences")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi
public class SentenceController {

    @Autowired
    private SentenceService sentenceService;

    @GetMapping("/practice")
    public ResponseEntity<SentenceDTO> getPracticeSentence(
            @RequestParam(defaultValue = "Daily Life") String topic,
            @RequestParam(defaultValue = "BEGINNER") String level,
            @RequestParam(defaultValue = "false") boolean forceAI
    ) {
        SentenceDTO result = sentenceService.getPracticeSentence(topic, level, forceAI);
        return ResponseEntity.ok(result);
    }
}