package com.aesp.backend.controller;

import com.aesp.backend.dto.response.SpeakingResponseDTO;
import com.aesp.backend.entity.TestQuestion;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.service.TestQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test-questions")
@CrossOrigin(origins = "*")
public class TestQuestionController {
    
    @Autowired
    private TestQuestionService service;

    @Autowired
    private UserRepository userRepository;

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

    @PostMapping("/submit-result")
    public ResponseEntity<?> submitTestResult(@RequestBody Map<String, String> result) {
        String email = result.get("email");
        String level = result.get("level");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTested(true);
            user.setLevel(level);
            userRepository.save(user);

            // Trả về đúng DTO chứa email và level
            return ResponseEntity.ok(new SpeakingResponseDTO(email, level));
        } else {
            // Trả về thông báo lỗi nếu không tìm thấy
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy email người dùng!");
        }
    }
}