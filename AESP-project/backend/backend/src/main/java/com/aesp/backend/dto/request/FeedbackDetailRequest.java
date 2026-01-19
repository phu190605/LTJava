package com.aesp.backend.dto.request;

public class FeedbackDetailRequest {
    public String exerciseId;
    public String mistake;
    public String correction;
    public String tag; // GRAMMAR / PRONUNCIATION / VOCABULARY
    public int time;
}
