package com.aesp.backend.controller;

import com.aesp.backend.dto.request.respone.AdminPaymentHistoryResponse;
import com.aesp.backend.entity.PaymentHistory;
import com.aesp.backend.repository.PaymentHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/payments")
@CrossOrigin("*")
public class AdminPaymentController {

    private final PaymentHistoryRepository paymentRepo;

    public AdminPaymentController(PaymentHistoryRepository paymentRepo) {
        this.paymentRepo = paymentRepo;
    }

    // Admin xem TOÀN BỘ lịch sử mua gói
    @GetMapping
    public List<AdminPaymentHistoryResponse> getAllPayments() {

        List<PaymentHistory> list = paymentRepo.findAll();

        return list.stream().map(p ->
                new AdminPaymentHistoryResponse(
                        p.getUser().getEmail(),
                        p.getServicePackage().getPackageName(),
                        p.getAmount(),
                        p.getPaymentDate(),
                        p.getStatus().name()
                )
        ).collect(Collectors.toList());
    }
}
