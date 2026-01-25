package com.aesp.backend.service;

import com.aesp.backend.dto.response.FillResultWithQuestionDTO;
import com.aesp.backend.entity.FillResult;
import com.aesp.backend.entity.TestQuestion;
import com.aesp.backend.repository.FillResultRepository;
import com.aesp.backend.repository.TestQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FillResultService {
    @Autowired
    private FillResultRepository fillResultRepository;
    @Autowired
    private TestQuestionRepository testQuestionRepository;

    public List<FillResultWithQuestionDTO> getFillResultsWithQuestions(Long userId) {
        List<FillResult> fillResults = fillResultRepository.findAllByUserIdOrderByPartNumberAsc(userId);
        // Only get fill-type questions, order by id ASC
        List<TestQuestion> fillQuestions = testQuestionRepository.findAll().stream()
                .filter(q -> "fill".equalsIgnoreCase(q.getType()))
                .sorted((a, b) -> Long.compare(a.getId(), b.getId()))
                .toList();
        List<FillResultWithQuestionDTO> result = new ArrayList<>();
        for (FillResult fill : fillResults) {
            FillResultWithQuestionDTO dto = new FillResultWithQuestionDTO();
            dto.setPartNumber(fill.getPartNumber());
            dto.setUserAnswer(fill.getUserAnswer());
            dto.setCorrect(fill.isCorrect());
            dto.setCreatedAt(fill.getCreatedAt() != null ? fill.getCreatedAt().toString() : null);
            // Map partNumber (1-based) to fillQuestions index
            String questionContent = "";
            int idx = fill.getPartNumber() - 1;
            if (idx >= 0 && idx < fillQuestions.size()) {
                questionContent = fillQuestions.get(idx).getContent();
            }
            dto.setQuestionContent(questionContent);
            result.add(dto);
        }
        return result;
    }
}
