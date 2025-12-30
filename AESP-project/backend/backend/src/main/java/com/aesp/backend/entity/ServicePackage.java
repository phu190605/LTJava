package com.aesp.backend.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "service_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicePackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Integer id;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(name = "has_mentor")
    private Boolean hasMentor;

    private BigDecimal price;

    @Column(name = "duration_months")
    private Integer durationMonths;

    private String description;

    @Column(columnDefinition = "json")
    private String features;
}