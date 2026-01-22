package com.aesp.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.dto.request.PaymentHistoryResponse;
import com.aesp.backend.entity.PaymentHistory;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.PaymentHistoryRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentHistoryRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/history")
    public ResponseEntity<?> getMyPaymentHistory(@RequestHeader("Authorization") String token) {
        try {
            // 1. Lấy User từ Token
            String email = jwtUtils.getEmailFromToken(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 2. Lấy danh sách từ DB
            List<PaymentHistory> historyList = paymentRepository.findByUserOrderByPaymentDateDesc(user);

            // 3. Chuyển đổi sang DTO
            List<PaymentHistoryResponse> response = historyList.stream().map(h -> new PaymentHistoryResponse(
                    h.getPaymentId(),
                    h.getServicePackage().getPackageName(),
                    h.getAmount(),
                    h.getPaymentDate(),
                    h.getStatus().toString())).collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy lịch sử: " + e.getMessage());
        }
    }
}