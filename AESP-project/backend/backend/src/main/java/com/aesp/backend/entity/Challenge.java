package com.aesp.backend.entity;

import com.aesp.backend.entity.ChallengeType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "challenges")
@Data
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    private String title; // Ví dụ: "Chiến binh kiên trì"
    private String description; // Ví dụ: "Luyện nói đủ 10 phút hôm nay"

    @Column(name = "type")
    private String type; // Loại: "VOCAL", "SPEAKING_TIME", ...

    @Column(name = "target_value")
    private Integer targetValue; // Mục tiêu: 10 (phút)

    @Column(name = "xp_reward")
    private Integer xpReward; // Phần thưởng: 50 XP

    // --- Manual getter for targetValue, xpReward, title ---
    public Integer getTargetValue() {
        return targetValue;
    }

    public Integer getXpReward() {
        return xpReward;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

}