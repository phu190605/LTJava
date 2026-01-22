package com.aesp.backend.controller;

import com.aesp.backend.entity.TestQuestion;
import com.aesp.backend.service.TestQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/test-questions")
@CrossOrigin(origins = "*")
public class TestQuestionController {
    @Autowired
    private TestQuestionService service;

    @GetMapping
    public List<TestQuestion> getAll() {
        List<TestQuestion> questions = service.getAll();
        java.util.Collections.shuffle(questions);
        return questions;
    }

    @GetMapping("/level/{level}")
    public List<TestQuestion> getByLevel(@PathVariable String level) {
        return service.getByLevel(level);
    }
}
