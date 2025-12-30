package com.aesp.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "payment_history")
@Data
public class PaymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    // Liên kết tới bảng Users (Nhiều hóa đơn thuộc về 1 User)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Liên kết tới bảng ServicePackages (Nhiều hóa đơn thuộc về 1 Gói)
    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private ServicePackage servicePackage;

    private BigDecimal amount; // Số tiền

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING) // Lưu dưới dạng chuỗi ("SUCCESS", "FAILED")
    private PaymentStatus status;

    // Tự động gán thời gian hiện tại khi lưu record mới
    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
        if (status == null) {
            status = PaymentStatus.SUCCESS;
        }
    }
}

// Enum cho trạng thái thanh toán (Bạn có thể để chung trong file này hoặc tách riêng)
enum PaymentStatus {
    SUCCESS,
    FAILED
}