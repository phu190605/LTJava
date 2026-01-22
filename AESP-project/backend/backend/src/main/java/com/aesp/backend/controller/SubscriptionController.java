package com.aesp.backend.controller;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Calendar;
import java.util.Map;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import com.aesp.backend.dto.request.UpgradeRequest;
import com.aesp.backend.entity.*;
import com.aesp.backend.repository.*;
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
                    .orElseGet(() -> {
                        LearnerProfile newProfile = new LearnerProfile();
                        newProfile.setUser(user);
                        return profileRepo.save(newProfile);
                    });

            // B. Tìm gói cước
            ServicePackage newPackage = packageRepo.findById(request.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

            // C. Lưu lịch sử thanh toán
            PaymentHistory payment = new PaymentHistory();
            payment.setUser(user);
            payment.setServicePackage(newPackage);
            payment.setAmount(newPackage.getPrice());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStatus(PaymentHistory.PaymentStatus.SUCCESS);
            paymentRepo.save(payment);

            // D. Cập nhật gói hiện tại
            profile.setCurrentPackage(newPackage);

            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            c.add(Calendar.DATE, 30);
            profile.setSubscriptionEndDate(c.getTime());

            profileRepo.save(profile);

            return ResponseEntity.ok("Nâng cấp gói thành công lên: " + newPackage.getPackageName());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi nâng cấp: " + e.getMessage());
        }
    }

    // 3. API kiểm tra Learner có gói Mentor hay không
    @GetMapping("/learner/mentor/status")
    public ResponseEntity<?> getLearnerMentorStatus(
            @RequestHeader("Authorization") String token
    ) {
        String email = jwtUtils.getEmailFromToken(token.substring(7));
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LearnerProfile profile = profileRepo.findByUser(user).orElse(null);

        boolean hasMentor = false;
        String packageName = null;
        Date subscriptionEndDate = null;

        if (profile != null && profile.getCurrentPackage() != null) {
            Boolean flag = profile.getCurrentPackage().getHasMentor();
            hasMentor = flag != null && flag;
            packageName = profile.getCurrentPackage().getPackageName();
            subscriptionEndDate = profile.getSubscriptionEndDate();
        }

        return ResponseEntity.ok(
                Map.of(
                        "hasMentor", hasMentor,
                        "packageName", packageName,
                        "subscriptionEndDate", subscriptionEndDate
                )
        );
    }
}
