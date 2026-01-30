package com.aesp.backend.service;

import com.aesp.backend.dto.request.LearningPathRequest;
import com.aesp.backend.dto.request.respone.LearningPathResponse;
import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class LearningPathService {

    @Autowired
    private LearningPathRepository pathRepository;

    /**
     * TẠO LEARNING PATH TỪ REQUEST
     * Đơn giản: chỉ cần level, goalCode, topicCode, description
     */
    public LearningPath createLearningPath(LearningPathRequest request) throws Exception {
        LearningPath path = new LearningPath();
        path.setLevel(request.getLevel());
        path.setGoalCode(request.getGoalCode());
        path.setTopicCode(request.getTopicCode());
        path.setDescription(request.getDescription());
        
        return pathRepository.save(path);
    }

    /**
     * LẤY LEARNING PATH THEO ID
     */
    public Optional<LearningPath> getLearningPathById(Long pathId) {
        return pathRepository.findById(pathId);
    }

    /**
     * LẤY TẤT CẢ LEARNING PATHS THEO LEVEL
     */
    public List<LearningPath> getLearningPathsByLevel(String level) {
        return pathRepository.findByLevel(level);
    }

    /**
     * LẤY LEARNING PATHS THEO GOAL CODE
     */
    public List<LearningPath> getLearningPathsByGoalCode(String goalCode) {
        return pathRepository.findByGoalCode(goalCode);
    }

    /**
     * LẤY LEARNING PATHS THEO TOPIC CODE
     */
    public List<LearningPath> getLearningPathsByTopicCode(String topicCode) {
        return pathRepository.findByTopicCode(topicCode);
    }

    /**
     * LẤY LEARNING PATH THEO LEVEL, GOAL CODE VÀ TOPIC CODE
     */
    public Optional<LearningPath> getLearningPathByLevelGoalTopic(String level, String goalCode, String topicCode) {
        return pathRepository.findByLevelAndGoalCodeAndTopicCode(level, goalCode, topicCode);
    }

    /**
     * CONVERT LEARNING PATH TO RESPONSE DTO
     */
    public LearningPathResponse convertToResponse(LearningPath path) {
        LearningPathResponse response = new LearningPathResponse();
        response.setPathId(path.getPathId());
        response.setLevel(path.getLevel());
        response.setGoalCode(path.getGoalCode());
        response.setTopicCode(path.getTopicCode());
        response.setDescription(path.getDescription());
        response.setCreatedAt(path.getCreatedAt());
        response.setUpdatedAt(path.getUpdatedAt());
        
        return response;
    }
}
