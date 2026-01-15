package com.aesp.backend.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "service_packages")
public class ServicePackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Integer packageId;

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

    // --- THÊM TRƯỜNG NÀY ĐỂ QUẢN LÝ ẨN/HIỆN ---
    @Column(columnDefinition = "boolean default true")
    private Boolean active = true; 

    // --- CONSTRUCTORS ---
    public ServicePackage() {}

    public ServicePackage(Integer packageId, String packageName, Boolean hasMentor, BigDecimal price, Integer durationMonths, String description, String features, Boolean active) {
        this.packageId = packageId;
        this.packageName = packageName;
        this.hasMentor = hasMentor;
        this.price = price;
        this.durationMonths = durationMonths;
        this.description = description;
        this.features = features;
        this.active = active;
    }

    // --- GETTER & SETTER THỦ CÔNG (Đầy đủ) ---
    public Integer getPackageId() { return packageId; }
    public void setPackageId(Integer packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public Boolean getHasMentor() { return hasMentor; }
    public void setHasMentor(Boolean hasMentor) { this.hasMentor = hasMentor; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    // Getter cho Active (fix lỗi isActive undefined)
    public Boolean isActive() { return active; }
    public Boolean getActive() { return active; } // Thêm cả hàm này cho chắc
    public void setActive(Boolean active) { this.active = active; }
}