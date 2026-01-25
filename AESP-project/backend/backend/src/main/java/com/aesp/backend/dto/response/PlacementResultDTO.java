package com.aesp.backend.dto.response;

public class PlacementResultDTO {
    private String levelBefore;
    private String levelAfter;
    private String mentorNote;

    public String getLevelBefore() {
        return levelBefore;
    }

    public void setLevelBefore(String levelBefore) {
        this.levelBefore = levelBefore;
    }

    public String getLevelAfter() {
        return levelAfter;
    }

    public void setLevelAfter(String levelAfter) {
        this.levelAfter = levelAfter;
    }

    public String getMentorNote() {
        return mentorNote;
    }

    public void setMentorNote(String mentorNote) {
        this.mentorNote = mentorNote;
    }
}
