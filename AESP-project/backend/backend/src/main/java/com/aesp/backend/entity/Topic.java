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
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Ví dụ: "Daily Life"
    
    private String slug; // Ví dụ: "daily-life"
    
    @Column(columnDefinition = "TEXT")
    private String description;
}