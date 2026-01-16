package com.aesp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aesp.backend.entity.PaymentHistory;
import com.aesp.backend.dto.request.respone.AdminReportResponse;

@Repository
public interface AdminReportRepository
        extends JpaRepository<PaymentHistory, Long> {

    @Query("""
        SELECT new com.aesp.backend.dto.request.respone.AdminReportResponse(
            sp.packageName,
            COUNT(ph.id),
            SUM(ph.amount)
        )
        FROM PaymentHistory ph
        JOIN ph.servicePackage sp
        WHERE ph.status = 'SUCCESS'
        GROUP BY sp.packageName
        ORDER BY SUM(ph.amount) DESC
    """)
    List<AdminReportResponse> getRevenueReport();
}
