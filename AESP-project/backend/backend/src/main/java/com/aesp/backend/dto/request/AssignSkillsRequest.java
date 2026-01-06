package com.aesp.backend.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignSkillsRequest {
    private Long mentorId;
    private List<String> skills;
}
