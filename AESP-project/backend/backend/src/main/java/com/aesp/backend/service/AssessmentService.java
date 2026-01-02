package com.aesp.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.aesp.backend.entity.AssessmentResult;
import com.aesp.backend.repository.AssessmentResultRepository;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentResultRepository repo;

    public AssessmentResult evaluateAndSave(AssessmentResult r) {

        double avg = (
            r.getPronunciationScore()
          + r.getGrammarScore()
          + r.getVocabularyScore()
          + r.getFluencyScore()
        ) / 4.0;

        if (avg < 50) r.setOverallLevel("BEGINNER");
        else if (avg < 75) r.setOverallLevel("INTERMEDIATE");
        else r.setOverallLevel("ADVANCED");

        return repo.save(r);
    }
}
