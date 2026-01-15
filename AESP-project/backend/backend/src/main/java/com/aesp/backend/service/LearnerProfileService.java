package com.aesp.backend.service;

import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.repository.LearnerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    /**
     * MERGE LOGIC: Hàm này xử lý việc lưu lộ trình và ghi vào Database.
     * Nó tìm bản ghi cũ của User để thực hiện UPDATE, đảm bảo is_setup_complete chuyển thành 1.
     */
    @Transactional
    public LearnerProfile saveProfileSetup(Long userId, LearnerProfile profileData) {
        // 1. Tìm bản ghi hiện có dựa trên userId (để lấy được ID của Profile đó)
        LearnerProfile existingProfile = profileRepo.findByUser_Id(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy profile cho User ID: " + userId));

        // 2. Cập nhật các thông tin lộ trình từ dữ liệu người dùng gửi lên
        existingProfile.setMainGoal(profileData.getMainGoal());
        existingProfile.setCurrentLevelCode(profileData.getCurrentLevelCode());
        existingProfile.setDailyLearningGoalMinutes(profileData.getDailyLearningGoalMinutes());
        existingProfile.setInterests(profileData.getInterests());
        existingProfile.setLearningMode(profileData.getLearningMode());
        existingProfile.setProficiencyLevel(profileData.getProficiencyLevel());

        // 3. QUAN TRỌNG: Ép trạng thái đã hoàn thành thiết lập thành true
        // Khi lưu xuống DB, cột is_setup_complete sẽ chuyển từ 0 thành 1
        existingProfile.setSetupComplete(true);
        
        // 4. Lưu lại bản ghi đã có ID sẵn -> Hibernate sẽ tự động gọi lệnh UPDATE
        return profileRepo.save(existingProfile);
    }
}