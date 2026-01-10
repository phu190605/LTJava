package com.aesp.backend.service;

import com.aesp.backend.entity.TestQuestion;
import com.aesp.backend.repository.TestQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TestQuestionService {
    @Autowired
    private TestQuestionRepository repo;

    public List<TestQuestion> getAll() {
        return repo.findAll();
    }

    public List<TestQuestion> getByLevel(String level) {
        return repo.findByLevel(level);
    }
}
