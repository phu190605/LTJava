package com.aesp.backend.dto;

public class SpeakingRequestDTO {
    private Long userId;
    private int partNumber;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getPartNumber() { return partNumber; }
    public void setPartNumber(int partNumber) { this.partNumber = partNumber; }
}

