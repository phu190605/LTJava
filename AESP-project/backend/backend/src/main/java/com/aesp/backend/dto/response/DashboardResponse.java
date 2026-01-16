package com.aesp.backend.dto.response;

import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

/**
 * DTO chứa dữ liệu tổng hợp cho trang Dashboard người dùng
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    // --- Thông tin cá nhân ---
    private String fullName;
    private String avatarUrl;
    private String currentLevel;
    private String mainGoal;
    
    // --- Chỉ số học tập hàng ngày ---
    private int dailyGoalMinutes;
    private int learnedMinutes;
    private List<String> interests;
    
    // --- Thông tin gói dịch vụ & Tài khoản ---
    private String packageName;
    private boolean hasMentor;
    private Long daysLeft;

    // --- DỮ LIỆU BIỂU ĐỒ (TRENDS & HEATMAP) ---
    // Key: "yyyy-MM-dd", Value: Số hoạt động hoặc thời gian học
    private Map<String, Integer> heatMapData;      
    
    // Dữ liệu điểm số cho biểu đồ đường
    private List<Double> pronunciationScores;      
    private List<Double> fluencyScores;            
    
    // Nhãn trục X (Ví dụ: "2026-01-16")
    private List<String> trendLabels;              
    
    // Tổng số từ vựng người dùng đã học được
    private int totalWordsLearned;
}