package com.aesp.backend.dto.response;

import com.aesp.backend.entity.Challenge;
import lombok.Data;

@Data
public class ChallengeDTO {
    private Long id;
    private String title;
    private String description;
    private String type;
    private Integer targetValue;
    private Integer xpReward;
    private boolean completed;

    public ChallengeDTO(Challenge ch, boolean completed) {
        this.id = ch.getId();
        this.title = ch.getTitle();
        this.description = ch.getDescription();
        this.type = ch.getType();
        this.targetValue = ch.getTargetValue();
        this.xpReward = ch.getXpReward();
        this.completed = completed;
    }
}
