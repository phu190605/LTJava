package com.aesp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.aesp.backend.entity.User;
import com.aesp.backend.entity.PaymentHistory;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {

    // Hàm này giúp lấy danh sách lịch sử mua hàng của một User cụ thể
    // (Phục vụ cho yêu cầu: "View learner package purchase history" trong đề tài)
    List<PaymentHistory> findByUser_Id(Long userId);

    // Tìm tất cả lịch sử của 1 user, sắp xếp mới nhất lên đầu
    List<PaymentHistory> findByUserOrderByPaymentDateDesc(User user);
}