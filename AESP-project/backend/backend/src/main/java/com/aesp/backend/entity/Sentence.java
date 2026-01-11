package com.aesp.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sentences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sentence {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết nhiều câu vào 1 Topic (Many-to-One)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // Câu tiếng Anh

    @Column(name = "vietnamese_meaning", columnDefinition = "TEXT")
    private String vietnameseMeaning;

    @Column(nullable = false)
    private String level; // BEGINNER, INTERMEDIATE...

    private String source; // 'SYSTEM' hoặc 'AI'

    // Constructor tiện lợi
    public Sentence(Topic topic, String content, String vietnameseMeaning, String level, String source) {
        this.topic = topic;
        this.content = content;
        this.vietnameseMeaning = vietnameseMeaning;
        this.level = level;
        this.source = source;
    }
}