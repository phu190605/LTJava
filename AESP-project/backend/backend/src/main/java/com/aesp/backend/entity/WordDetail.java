package com.aesp.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore; // Import thêm cái này
import com.aesp.backend.entity.SpeechAssessment;
@Data
@Entity
@Table(name = "word_details") // Nên đặt tên bảng rõ ràng
public class WordDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- SỬA ĐOẠN NÀY ---
    // Thay vì dùng Long assessmentId, hãy dùng quan hệ @ManyToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id") // Tên cột trong Database
    @JsonIgnore // Quan trọng: Để tránh lỗi vòng lặp vô tận khi chuyển sang JSON
    private SpeechAssessment speechAssessment;
    // --------------------

    private String word;
    private Double accuracyScore;
    private String errorType; // "Omission", "Mispronunciation"
}