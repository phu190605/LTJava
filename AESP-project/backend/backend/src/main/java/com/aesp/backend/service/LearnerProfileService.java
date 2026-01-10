package com.aesp.backend.service;

import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.repository.LearnerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class LearnerProfileService {
    @Autowired
    private LearnerProfileRepository profileRepo;

    public Optional<LearnerProfile> getByUserId(Long userId) {
        return profileRepo.findByUser_Id(userId);
    }

    public LearnerProfile save(LearnerProfile profile) {
        return profileRepo.save(profile);
    }
}
