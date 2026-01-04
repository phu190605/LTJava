package com.aesp.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import com.aesp.backend.entity.WordDetail;

@Data
@Entity
@Table(name = "speech_assessments")
public class SpeechAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Giữ nguyên Long userId cho đơn giản nếu bạn chưa rành JPA Relation
    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String referenceText;

    private String audioUrl;

    // Điểm số
    private Double accuracyScore;
    private Double fluencyScore;
    private Double completenessScore;
    private Double prosodyScore; // Bổ sung cho khớp với DTO
    private Double overallScore;

    @CreationTimestamp // Dùng cái này chuẩn hơn
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Liên kết để lưu chi tiết từng từ (Cho tính năng Heatmap)
    @OneToMany(mappedBy = "speechAssessment", cascade = CascadeType.ALL)
    private List<WordDetail> wordDetails;
}