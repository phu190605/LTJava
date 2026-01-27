package com.aesp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LeaderboardResponse {
    private int rank;           // Thứ hạng (1, 2, 3...)
    private Long userId;        // ID người dùng (để click vào xem profile nếu cần)
    private String displayName; // Tên hiển thị (đẹp hơn tên đăng nhập)
    private String avatarUrl;   // Ảnh đại diện
    private Long totalXp;       // Điểm số
    private String badge;       // Huy hiệu (Mầm non, Học giả...)

    // Constructor thủ cong
    public LeaderboardResponse(int rank, Long userId, String displayName, String avatarUrl, Long totalXp, String badge) {
        this.rank = rank;
        this.userId = userId;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.totalXp = totalXp;
        this.badge = badge;
    }
}