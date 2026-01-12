
package com.aesp.backend.controller;

import com.aesp.backend.entity.TestQuestion;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.service.TestQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-questions")
@CrossOrigin(origins = "*")
public class TestQuestionController {
    
    @Autowired
    private TestQuestionService service;

    @Autowired
    private UserRepository userRepository; // Inject repository để lưu dữ liệu user

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

    // --- ĐÂY LÀ HÀM CẬP NHẬT SQL BẠN ĐANG THIẾU ---
    @PostMapping("/submit-result")
    public ResponseEntity<?> submitTestResult(@RequestBody Map<String, String> result) {
        String email = result.get("email");
        String level = result.get("level");

        // Tìm user theo email, nếu thấy thì cập nhật is_tested = 1 và lưu level
        return userRepository.findByEmail(email).map(user -> {
            user.setTested(true);   // Cập nhật is_tested thành true (1)
            user.setLevel(level);    // Lưu level (A1, A2...)
            userRepository.save(user); // Lệnh này sẽ thực thi UPDATE trong SQL
            return ResponseEntity.ok("Cập nhật thành công trình độ " + level + " cho " + email);
        }).orElse(ResponseEntity.badRequest().body("Lỗi: Không tìm thấy email người dùng!"));
    }
}