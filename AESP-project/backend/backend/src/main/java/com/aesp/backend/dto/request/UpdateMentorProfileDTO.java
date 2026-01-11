package com.aesp.backend.dto.request;

import java.util.List;

public class UpdateMentorProfileDTO {

    public String mentorId;
    public String fullName;
    public String bio;
    public List<String> skills;
    public List<String> certificates;
}