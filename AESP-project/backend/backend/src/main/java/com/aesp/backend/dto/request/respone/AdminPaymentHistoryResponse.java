package com.aesp.backend.dto.request.respone;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminPaymentHistoryResponse {

    private String learnerEmail;
    private String learnerName;   
    private String packageName;
    private BigDecimal amount;
    private LocalDateTime date;
    private String status;

    public AdminPaymentHistoryResponse(
            String learnerEmail,
            String learnerName,    
            String packageName,
            BigDecimal amount,
            LocalDateTime date,
            String status
    ) {
        this.learnerEmail = learnerEmail;
        this.learnerName = learnerName;
        this.packageName = packageName;
        this.amount = amount;
        this.date = date;
        this.status = status;
    }

    public String getLearnerEmail() { return learnerEmail; }
    public String getLearnerName() { return learnerName; }
    public String getPackageName() { return packageName; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getDate() { return date; }
    public String getStatus() { return status; }
}
