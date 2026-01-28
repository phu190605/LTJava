package com.aesp.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "user_gamification_stats")
@Data // Tự động sinh Getters, Setters, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class UserGamificationStats {

    // Sử dụng user_id làm khóa chính (Primary Key) luôn vì mối quan hệ 1-1 với User
    // Điều này giúp query nhanh hơn khi biết userId
    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0; // Mặc định là 0

    @Column(name = "max_streak", nullable = false)
    private Integer maxStreak = 0; // Mặc định là 0

    // Dùng LocalDate để chỉ lưu ngày/tháng/năm (bỏ qua giờ phút giây)
    // Giúp so sánh chuỗi ngày (streak) chính xác hơn
    @Column(name = "last_practice_date")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastPracticeDate;

    // Tổng điểm XP dùng cho Luồng 4 (Leaderboard) và Luồng 2
    @Column(name = "total_xp", nullable = false)
    private Long totalXp = 0L;

    // --- Manual getter/setter ---
    public LocalDate getLastPracticeDate() {
        return lastPracticeDate;
    }

    public void setLastPracticeDate(LocalDate lastPracticeDate) {
        this.lastPracticeDate = lastPracticeDate;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getMaxStreak() {
        return maxStreak;
    }

    public void setMaxStreak(Integer maxStreak) {
        this.maxStreak = maxStreak;
    }

    public Long getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(Long totalXp) {
        this.totalXp = totalXp;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // --- Các phương thức tiện ích (Helper Methods) ---

    // Phương thức tăng streak (Dùng cho Luồng 1)
    public void incrementStreak() {
        this.currentStreak++;
        if (this.currentStreak > this.maxStreak) {
            this.maxStreak = this.currentStreak;
        }
        this.lastPracticeDate = LocalDate.now();
    }

    // Phương thức reset streak (Dùng cho Luồng 1 khi bị đứt quãng)
    public void resetStreak() {
        this.currentStreak = 1;
        this.lastPracticeDate = LocalDate.now();
    }

    // Phương thức cộng XP (Dùng cho Luồng 2)
    public void addXp(int xpAmount) {
        this.totalXp += xpAmount;
    }



    //Phần sửa đổi để làm trang xếp hạng
    // Giải thích: Chúng ta map quan hệ 1-1. 
    // "name = user_id": Cột user_id ở bảng hiện tại (bảng Stats).
    // "referencedColumnName = user_id": Cột user_id ở bảng đích (bảng LearnerProfile).
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private LearnerProfile learnerProfile;
    public LearnerProfile getLearnerProfile() {
        return learnerProfile;
    }

    public void setLearnerProfile(LearnerProfile learnerProfile) {
        this.learnerProfile = learnerProfile;
    }
}