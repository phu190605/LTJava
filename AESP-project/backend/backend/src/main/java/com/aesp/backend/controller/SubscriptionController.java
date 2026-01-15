package com.aesp.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import com.aesp.backend.dto.request.UpgradeRequest;
import com.aesp.backend.entity.PaymentHistory;
import com.aesp.backend.entity.LearnerProfile;
import com.aesp.backend.entity.User;
import com.aesp.backend.entity.ServicePackage;
import com.aesp.backend.repository.ServicePackageRepository;
import com.aesp.backend.repository.LearnerProfileRepository;
import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.repository.PaymentHistoryRepository;
import com.aesp.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/subscription")
@CrossOrigin("*")
public class SubscriptionController {

    @Autowired
    private ServicePackageRepository packageRepo;
    @Autowired
    private LearnerProfileRepository profileRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PaymentHistoryRepository paymentRepo;
    @Autowired
    private JwtUtils jwtUtils;

    // 1. Lấy danh sách tất cả các gói (để hiển thị bảng giá)
    @GetMapping("/packages")
    public ResponseEntity<?> getAllPackages() {
        return ResponseEntity.ok(packageRepo.findAll());
    }

    // 2. API Nâng cấp gói (Giả lập thanh toán thành công ngay lập tức)
    @PostMapping("/upgrade")
    @Transactional
    public ResponseEntity<?> upgradePackage(@RequestHeader("Authorization") String token,
            @RequestBody UpgradeRequest request) {
        try {
            // A. Lấy User từ Token
            String email = jwtUtils.getEmailFromToken(token.substring(7));
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            LearnerProfile profile = profileRepo.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            // B. Tìm gói cước muốn mua
            ServicePackage newPackage = packageRepo.findById(request.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

            // C. Tạo Lịch sử thanh toán (Lưu vết trước)
            PaymentHistory payment = new PaymentHistory();
            payment.setUser(user);
            payment.setServicePackage(newPackage);
            payment.setAmount(newPackage.getPrice());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStatus(PaymentHistory.PaymentStatus.SUCCESS); // Giả định thanh toán luôn thành công
            paymentRepo.save(payment);

            // D. Cập nhật Profile User (Đổi gói & Cộng ngày)
            profile.setCurrentPackage(newPackage);

            // Logic cộng ngày: Mặc định cộng 30 ngày từ hôm nay
            // (Nếu muốn xịn hơn: Nếu gói cũ chưa hết hạn thì cộng nối tiếp, nhưng làm đơn
            // giản trước)
            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            c.add(Calendar.DATE, 30); // Cộng 30 ngày
            profile.setSubscriptionEndDate(c.getTime());

            profileRepo.save(profile);

            return ResponseEntity.ok("Nâng cấp gói thành công lên: " + newPackage.getPackageName());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi nâng cấp: " + e.getMessage());
        }
    }
}