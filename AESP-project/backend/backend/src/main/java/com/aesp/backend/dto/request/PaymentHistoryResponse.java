package com.aesp.backend.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentHistoryResponse {
    private Long id;
    private String packageName;
    private BigDecimal amount;
    private LocalDateTime date;
    private String status; // "SUCCESS" hoặc "FAILED"

    // Constructor
    public PaymentHistoryResponse(Long id, String packageName, BigDecimal amount, LocalDateTime date, String status) {
        this.id = id;
        this.packageName = packageName;
        this.amount = amount;
        this.date = date;
        this.status = status;
    }

    // Getters & Setters (Bắt buộc để Jackson chuyển thành JSON)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}