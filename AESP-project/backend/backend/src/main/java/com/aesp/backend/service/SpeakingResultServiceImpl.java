package com.aesp.backend.service;

import com.aesp.backend.entity.SpeakingResult;
import com.aesp.backend.repository.SpeakingResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SpeakingResultServiceImpl implements SpeakingResultService {
    private final SpeakingResultRepository repository;

    @Autowired
    public SpeakingResultServiceImpl(SpeakingResultRepository repository) {
        this.repository = repository;
    }

    @Override
    public void saveSpeakingResult(SpeakingResult result) {
        repository.save(result);
    }
}
