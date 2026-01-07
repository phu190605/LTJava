package com.aesp.backend.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class ProfileSetupRequest {
    // 1. Thông tin sở thích, mục tiêu học tập (Bước 1)
    private Integer mainGoalId; // User chọn 1 mục tiêu

    // 2. Sở thích (Bước 2)
    private List<Integer> interestTopicIds; // User chọn nhiều sở thích

    // 3. Thông tin về thời gian học tập, trình độ hiện tại và gói dịch vụ (Bước 3)
    private Integer dailyTime; // 15 phút
    private String currentLevel; // "A1", "B2"...
    private Integer packageId; // ID gói dịch vụ (để lưu vào profile)
}