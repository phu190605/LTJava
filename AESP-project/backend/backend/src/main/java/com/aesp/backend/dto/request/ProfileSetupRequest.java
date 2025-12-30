package com.aesp.backend.dto.request;
import java.util.List;

import lombok.Data;

@Data
public class ProfileSetupRequest {
    // 1. Thông tin cá nhân (Bước 1)
    private String displayName;
    private String phone;
    private String avatarUrl;

    // 2. Thông tin sở thích, mục tiêu học tập (Bước 2)
    private Integer mainGoalId;           // User chọn 1 mục tiêu

    // 3. Sở thích (Bước 3)
    private List<Integer> interestTopicIds; // User chọn nhiều sở thích

    // 4. Thông tin về thời gian học tập, trình độ hiện tại và gói dịch vụ (Bước 4)
    private Integer dailyTime;            // 15 phút
    private String currentLevel;          // "A1", "B2"...
    private Integer packageId;            // ID gói dịch vụ (để lưu vào profile)
}