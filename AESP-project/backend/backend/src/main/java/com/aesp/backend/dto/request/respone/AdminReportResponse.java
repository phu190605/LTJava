package com.aesp.backend.dto.request.respone;

import java.math.BigDecimal;

public class AdminReportResponse {

    private String packageName;
    private Long totalSold;
    private BigDecimal totalRevenue;

    public AdminReportResponse(String packageName, Long totalSold, BigDecimal totalRevenue) {
        this.packageName = packageName;
        this.totalSold = totalSold;
        this.totalRevenue = totalRevenue;
    }

    public String getPackageName() {
        return packageName;
    }

    public Long getTotalSold() {
        return totalSold;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
}