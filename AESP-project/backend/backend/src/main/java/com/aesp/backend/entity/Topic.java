package com.aesp.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity; // Nếu không dùng Lombok thì tự tạo getter/setter
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "topics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_id")
    private Long topicId;

    @Column(name = "topic_name", nullable = false, unique = true)
    private String topicName;

    @Column(name = "topic_code", nullable = false, unique = true)
    private String topicCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_url")
    private String iconUrl;

    @Column(name = "category")
    private String category;
}