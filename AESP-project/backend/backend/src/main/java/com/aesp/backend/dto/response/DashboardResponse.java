package com.aesp.backend.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class DashboardResponse {
    // 1. Thông tin cá nhân cơ bản
    private String fullName;
    private String avatarUrl;
    private String currentLevel; // Ví dụ: "A1", "B2"

    // 2. Thông tin Gói dịch vụ (Subscription) - Quan trọng cho task của bạn
    private String packageName; // Ví dụ: "Gói Cơ bản", "Free Trial"
    private boolean hasMentor; // True nếu gói có Mentor
    private Long daysLeft; // Số ngày còn lại của gói

    // 3. Thông tin Mục tiêu & Sở thích
    private String mainGoal; // Ví dụ: "Đi du lịch", "Du học"
    private Integer dailyGoalMinutes; // Ví dụ: 30 phút
    private Integer learnedMinutes; // Đã học hôm nay (Tạm thời trả về 0 hoặc số giả)

    // 4. Danh sách Topic (Để hiển thị thẻ màu sắc)
    private List<String> interests; // ["Công nghệ", "Âm nhạc", "Kinh doanh"]

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(String currentLevel) {
        this.currentLevel = currentLevel;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public boolean isHasMentor() {
        return hasMentor;
    }

    public void setHasMentor(boolean hasMentor) {
        this.hasMentor = hasMentor;
    }

    public Long getDaysLeft() {
        return daysLeft;
    }

    public void setDaysLeft(Long daysLeft) {
        this.daysLeft = daysLeft;
    }

    public String getMainGoal() {
        return mainGoal;
    }

    public void setMainGoal(String mainGoal) {
        this.mainGoal = mainGoal;
    }

    public Integer getDailyGoalMinutes() {
        return dailyGoalMinutes;
    }

    public void setDailyGoalMinutes(Integer dailyGoalMinutes) {
        this.dailyGoalMinutes = dailyGoalMinutes;
    }

    public Integer getLearnedMinutes() {
        return learnedMinutes;
    }

    public void setLearnedMinutes(Integer learnedMinutes) {
        this.learnedMinutes = learnedMinutes;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }
}
