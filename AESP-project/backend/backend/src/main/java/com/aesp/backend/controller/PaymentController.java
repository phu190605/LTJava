package com.aesp.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aesp.backend.dto.response.PaymentHistoryResponse;
import com.aesp.backend.entity.PaymentHistory;
import com.aesp.backend.entity.User;
import com.aesp.backend.repository.PaymentHistoryRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.security.JwtUtils;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*") // Thêm dòng này để tránh lỗi CORS chặn Frontend
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

            // 3. Chuyển đổi sang DTO (CÓ KIỂM TRA NULL ĐỂ TRÁNH LỖI 500)
            List<PaymentHistoryResponse> response = historyList.stream().map(h -> {
                String pkgName = "Gói không xác định";
                if (h.getServicePackage() != null) {
                    pkgName = h.getServicePackage().getPackageName();
                }

                String statusStr = "UNKNOWN";
                if (h.getStatus() != null) {
                    statusStr = h.getStatus().toString();
                }

                String dateStr = "";
                if (h.getPaymentDate() != null) {
                    dateStr = h.getPaymentDate().toString();
                }

                return new PaymentHistoryResponse(
                        h.getPaymentId(),
                        pkgName,
                        h.getAmount(),
                        dateStr, // Truyền String vào
                        statusStr
                );
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console để bạn nhìn thấy
            return ResponseEntity.badRequest().body("Lỗi lấy lịch sử: " + e.getMessage());
        }
    }
}