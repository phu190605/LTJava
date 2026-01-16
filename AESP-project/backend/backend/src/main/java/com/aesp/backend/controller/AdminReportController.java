package com.aesp.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.aesp.backend.dto.request.respone.AdminReportResponse;
import com.aesp.backend.repository.AdminReportRepository;

@RestController
@RequestMapping("/api/admin/report")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminReportController {

    private final AdminReportRepository reportRepository;

    public AdminReportController(AdminReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @GetMapping
    public List<AdminReportResponse> getReport() {
        return reportRepository.getRevenueReport();
    }
}