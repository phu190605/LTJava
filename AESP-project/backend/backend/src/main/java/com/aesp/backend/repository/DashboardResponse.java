package com.aesp.backend.repository;

public class DashboardResponse {
    public int pendingSessions;
    public int completedFeedback;
    public int studentCount;
    public int totalMaterials;

    public DashboardResponse(int pendingSessions, int completedFeedback, int studentCount, int totalMaterials) {
        this.pendingSessions = pendingSessions;
        this.completedFeedback = completedFeedback;
        this.studentCount = studentCount;
        this.totalMaterials = totalMaterials;
    }
}
