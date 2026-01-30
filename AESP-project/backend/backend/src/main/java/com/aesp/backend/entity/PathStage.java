package com.aesp.backend.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Giai đoạn học tập trong lộ trình (ví dụ: Tháng 1, Tháng 2...)
 * Mỗi giai đoạn có:
 * - Chủ đề học
 * - Mục tiêu (số giờ học, số từ vựng...)
 * - Tài liệu được khuyến nghị
 * - Trạng thái tiến độ
 */
@Entity
@Table(name = "path_stages")
@Data // Lombok đã tự sinh Getter/Setter, nhưng bạn đang viết tay đè lên cũng không sao
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PathStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stage_id")
    private Long stageId;

    // ===== LIÊN KẾT VỚI LEARNING PATH =====
    @ManyToOne
    @JoinColumn(name = "path_id")
    private LearningPath learningPath;

    // ===== THÔNG TIN GIAI ĐOẠN =====
    @Column(name = "stage_name")
    private String stageName; // "Tháng 1", "Tháng 2", ...

    @Column(name = "stage_order")
    private Integer stageOrder; // 1, 2, 3, ...

    // >>>>>>>>>> PHẦN ĐÃ THÊM MỚI <<<<<<<<<<
    @Column(name = "is_locked")
    private Boolean isLocked = true; // Mặc định là khóa (true)
    // >>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<

    // ===== MỤC TIÊU CỦA GIAI ĐOẠN =====
    @Column(name = "target_level")
    private String targetLevel; // Cấp độ mục tiêu cuối giai đoạn

    @Column(name = "topic_focus", columnDefinition = "json")
    private String topicFocus; // ["Grammar", "Vocabulary", ...] (JSON)

    @Column(name = "target_hours")
    private Integer targetHours; // Số giờ học mục tiêu

    @Column(name = "target_vocabulary")
    private Integer targetVocabulary; // Số từ vựng mục tiêu

    // ===== TÀI LIỆU & HOẠT ĐỘNG =====
    @Column(name = "recommended_materials", columnDefinition = "json")
    private String recommendedMaterials; // JSON: danh sách tài liệu được khuyến nghị

    @Column(name = "activities", columnDefinition = "json")
    private String activities; // JSON: danh sách hoạt động (speaking, listening, ...)

    // ===== TIẾN ĐỘ =====
    @Column(name = "completed_hours")
    private Integer completedHours; // Giờ học đã hoàn thành

    @Column(name = "learned_vocabulary")
    private Integer learnedVocabulary; // Từ vựng đã học

    @Enumerated(EnumType.STRING)
    @Column(name = "stage_status")
    private StageStatus stageStatus; // NOT_STARTED, IN_PROGRESS, COMPLETED

    public enum StageStatus {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED
    }

    // ===== NGÀY =====
    @Temporal(TemporalType.DATE)
    @Column(name = "start_date")
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_date")
    private Date endDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    // ===== GHI CHÚ =====
    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    // ===== LIFECYCLE CALLBACKS =====
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        if (stageStatus == null) {
            stageStatus = StageStatus.NOT_STARTED;
        }
        if (isLocked == null) {
            isLocked = true; // Đảm bảo không bị null khi tạo mới
        }
    }

    // ===== GETTERS & SETTERS (Bổ sung cho field mới) =====

    public Boolean getIsLocked() {
        return isLocked;
    }

    public void setIsLocked(Boolean locked) {
        isLocked = locked;
    }

    // ... (Các Getter/Setter cũ giữ nguyên như code của bạn) ...

    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }

    public LearningPath getLearningPath() {
        return learningPath;
    }

    public void setLearningPath(LearningPath learningPath) {
        this.learningPath = learningPath;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public Integer getStageOrder() {
        return stageOrder;
    }

    public void setStageOrder(Integer stageOrder) {
        this.stageOrder = stageOrder;
    }

    public String getTargetLevel() {
        return targetLevel;
    }

    public void setTargetLevel(String targetLevel) {
        this.targetLevel = targetLevel;
    }

    public String getTopicFocus() {
        return topicFocus;
    }

    public void setTopicFocus(String topicFocus) {
        this.topicFocus = topicFocus;
    }

    public Integer getTargetHours() {
        return targetHours;
    }

    public void setTargetHours(Integer targetHours) {
        this.targetHours = targetHours;
    }

    public Integer getTargetVocabulary() {
        return targetVocabulary;
    }

    public void setTargetVocabulary(Integer targetVocabulary) {
        this.targetVocabulary = targetVocabulary;
    }

    public String getRecommendedMaterials() {
        return recommendedMaterials;
    }

    public void setRecommendedMaterials(String recommendedMaterials) {
        this.recommendedMaterials = recommendedMaterials;
    }

    public String getActivities() {
        return activities;
    }

    public void setActivities(String activities) {
        this.activities = activities;
    }

    public Integer getCompletedHours() {
        return completedHours;
    }

    public void setCompletedHours(Integer completedHours) {
        this.completedHours = completedHours;
    }

    public Integer getLearnedVocabulary() {
        return learnedVocabulary;
    }

    public void setLearnedVocabulary(Integer learnedVocabulary) {
        this.learnedVocabulary = learnedVocabulary;
    }

    public StageStatus getStageStatus() {
        return stageStatus;
    }

    public void setStageStatus(StageStatus stageStatus) {
        this.stageStatus = stageStatus;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}