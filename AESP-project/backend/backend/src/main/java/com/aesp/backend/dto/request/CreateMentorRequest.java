package com.aesp.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMentorRequest {
    private String fullName;
    private String email;
    private String password;
}
