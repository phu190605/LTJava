package com.aesp.backend.service;

import com.aesp.backend.dto.response.LeaderboardResponse;
import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.entity.UserGamificationStats;
import com.aesp.backend.repository.LearnerProfileRepository; // Import cái này
import com.aesp.backend.repository.UserGamificationStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LeaderboardService {

    @Autowired
    private UserGamificationStatsRepository statsRepository;
    
    @Autowired // Inject thêm Repository Profile vào
    private LearnerProfileRepository learnerProfileRepository;

    public List<LeaderboardResponse> getTopLearners(int limit) {
        // 1. Lấy danh sách Top điểm cao
        Pageable topLimit = PageRequest.of(0, limit);
        List<UserGamificationStats> topStats = statsRepository.findTopLearners(topLimit);

        List<LeaderboardResponse> responseList = new ArrayList<>();
        int currentRank = 1;

        for (UserGamificationStats stat : topStats) {
            String name = "Người dùng ẩn danh";
            String avatar = ""; // Mặc định rỗng để Frontend hiện icon

            // 2. TỰ TAY ĐI TÌM PROFILE (Cách này chắc chắn ra)
            // Tìm trong bảng learner_profiles xem có ai mang userId này không
            Optional<LearnerProfile> profileOpt = learnerProfileRepository.findByUser_Id(stat.getUserId());

            if (profileOpt.isPresent()) {
                LearnerProfile profile = profileOpt.get();
                // Lấy tên hiển thị
                if (profile.getDisplayName() != null && !profile.getDisplayName().isEmpty()) {
                    name = profile.getDisplayName();
                }
                // Lấy Avatar
                if (profile.getAvatarUrl() != null) {
                    avatar = profile.getAvatarUrl();
                }
            }

            // 3. Tính huy hiệu
            String badge = determineBadge(stat.getTotalXp());

            responseList.add(new LeaderboardResponse(
                    currentRank++,
                    stat.getUserId(),
                    name,
                    avatar,
                    stat.getTotalXp(),
                    badge
            ));
        }

        return responseList;
    }

    private String determineBadge(Long xp) {
        if (xp == null) xp = 0L;
        if (xp <= 100) return "Mầm non";
        if (xp <= 500) return "Học giả";
        return "Bậc thầy";
    }
}