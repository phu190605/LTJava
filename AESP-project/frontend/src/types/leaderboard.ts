// Đây là cái "khuôn" để React hiểu dữ liệu từ Java gửi sang
export interface LeaderboardItem {
    rank: number;       // Hạng (số nguyên)
    userId: number;     // ID người dùng
    displayName: string;// Tên hiển thị
    avatarUrl: string;  // Link ảnh
    totalXp: number;    // Điểm XP
    badge: string;      // Huy hiệu (Mầm non, Học giả...)
}