package com.aesp.backend.service;
import com.aesp.backend.entity.Challenge;
import com.aesp.backend.entity.UserChallengeProgress;
import com.aesp.backend.entity.UserGamificationStats;
import com.aesp.backend.entity.ChallengeType;
import com.aesp.backend.repository.ChallengeRepository;
import com.aesp.backend.repository.UserChallengeProgressRepository;
import com.aesp.backend.repository.UserGamificationStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class GamificationService {

    @Autowired
    private UserGamificationStatsRepository statsRepository;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private UserChallengeProgressRepository progressRepository;

    // ========================================================================
    // LUỒNG 1: THEO DÕI CHUỖI NGÀY HỌC (STREAK TRACKING FLOW)
    // ========================================================================

    /**
     * Hàm này được gọi khi User đăng nhập hoặc hoàn thành bài học
     * Nhiệm vụ: Tính toán Streak dựa trên ngày học cuối cùng.
     * 
     * @param userId ID của người dùng
     */
    @Transactional
    public void updateStreak(Long userId) {
        LocalDate today = LocalDate.now();

        // 1. Tìm bản ghi Stats, nếu chưa có thì tạo mới
        UserGamificationStats stats = statsRepository.findById(userId)
                .orElseGet(() -> {
                    UserGamificationStats newStats = new UserGamificationStats();
                    newStats.setUserId(userId);
                    newStats.setCurrentStreak(1);
                    newStats.setMaxStreak(1);
                    newStats.setTotalXp(0L);
                    newStats.setLastPracticeDate(today);
                    return newStats;
                });

        LocalDate lastDate = stats.getLastPracticeDate();

        if (lastDate == null) {
            // Lần đầu đăng nhập, bắt đầu streak mới
            stats.setCurrentStreak(1);
            stats.setMaxStreak(1);
        } else if (lastDate.isEqual(today)) {
            // Đã đăng nhập hôm nay, không thay đổi streak
        } else if (lastDate.isEqual(today.minusDays(1))) {
            // Đăng nhập liên tục, tăng streak
            stats.setCurrentStreak(stats.getCurrentStreak() + 1);
            if (stats.getCurrentStreak() > stats.getMaxStreak()) {
                stats.setMaxStreak(stats.getCurrentStreak());
            }
        } else {
            // Bỏ qua 1 ngày trở lên, reset streak về 0
            stats.setCurrentStreak(0);
        }
        // Luôn cập nhật ngày đăng nhập cuối cùng
        stats.setLastPracticeDate(today);
        statsRepository.save(stats);
    }

    // ========================================================================
    // LUỒNG 2: THỬ THÁCH & TÍCH ĐIỂM (CHALLENGES & SCORING FLOW)
    // ========================================================================

    /**
     * Xử lý hoạt động học tập để tính XP và cập nhật tiến độ nhiệm vụ
     * * @param userId: ID người dùng
     * 
     * @param type:  Loại hoạt động (ví dụ: SPEAKING_TIME, ACCURACY_SCORE)
     * @param value: Giá trị đạt được (ví dụ: 5 phút, hoặc 80 điểm)
     */
    @Transactional
    public void processActivity(Long userId, ChallengeType type, int value) {
        LocalDate today = LocalDate.now();

        // --- BƯỚC 1: CỘNG XP CƠ BẢN (DIRECT XP) ---

        int baseXp = 0;
        // Logic quy đổi điểm cơ bản
        if (type == ChallengeType.SPEAKING_TIME) {
            baseXp = value * 10; // Ví dụ: 1 phút = 10 XP
        } else if (type == ChallengeType.ACCURACY_SCORE) {
            baseXp = value / 2; // Ví dụ: 80 điểm = 40 XP
        }
        // Có thể thêm các case khác tại đây

        // Cập nhật XP cơ bản vào bảng tổng (dùng lại repository của Luồng 1)
        UserGamificationStats stats = statsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User stats not found for ID: " + userId));

        if (baseXp > 0) {
            stats.addXp(baseXp);
            System.out.println("User " + userId + ": Received " + baseXp + " Base XP.");
        }

        // --- BƯỚC 2: KIỂM TRA VÀ CẬP NHẬT NHIỆM VỤ HÀNG NGÀY ---

        // Lấy danh sách tất cả nhiệm vụ khớp với loại hoạt động vừa làm
        List<Challenge> challenges = challengeRepository.findByType(type);

        for (Challenge challenge : challenges) {
            // Tìm tiến độ hôm nay của user với nhiệm vụ này
            UserChallengeProgress progress = progressRepository
                    .findByUserIdAndChallengeIdAndDate(userId, challenge.getId(), today)
                    .orElseGet(() -> {
                        // Nếu chưa có (sáng sớm mới vào), tạo record mới
                        UserChallengeProgress p = new UserChallengeProgress();
                        p.setUserId(userId);
                        p.setChallenge(challenge);
                        p.setDate(today);
                        p.setCurrentValue(0);
                        p.setClaimed(false);
                        return p;
                    });

            // Nếu nhiệm vụ này đã nhận thưởng rồi thì bỏ qua
            if (progress.isClaimed()) {
                continue;
            }

            // Cộng dồn tiến độ
            int newValue = progress.getCurrentValue() + value;
            progress.setCurrentValue(newValue);

            // Kiểm tra điều kiện hoàn thành
            if (newValue >= challenge.getTargetValue()) {
                // ĐẠT MỐC -> Hoàn thành nhiệm vụ
                progress.setClaimed(true);
                progress.setCurrentValue(challenge.getTargetValue()); // Cap lại ở mức tối đa

                // Cộng XP thưởng của nhiệm vụ vào tổng
                stats.addXp(challenge.getXpReward());

                System.out.println("User " + userId + ": COMPLETED CHALLENGE '" + challenge.getTitle()
                        + "' -> Bonus " + challenge.getXpReward() + " XP");
            }

            // Lưu tiến độ nhiệm vụ
            progressRepository.save(progress);
        }

        // Lưu tổng XP mới cập nhật của User (bao gồm cả Base XP và Bonus XP nếu có)
        statsRepository.save(stats);
    }
     // Cộng XP trực tiếp cho user (dùng cho bài tập từ vựng)
    @Transactional
    public void addXpToUser(Long userId, int xp) {
        UserGamificationStats stats = statsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User stats not found for ID: " + userId));
        stats.addXp(xp);
        statsRepository.save(stats);
    }

}