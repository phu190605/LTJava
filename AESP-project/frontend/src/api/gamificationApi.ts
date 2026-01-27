import axiosClient from "./axiosClient"; 

// 2. Import kiểu dữ liệu từ file types bạn tạo lúc nãy
// (Dấu .. nghĩa là thoát ra ngoài thư mục api để tìm thư mục types)
import type { LeaderboardItem } from "../types/leaderboard";

const gamificationApi = {
  // Hàm gọi API lấy danh sách
  getLeaderboard: async (): Promise<LeaderboardItem[]> => {
    const url = '/leaderboard'; 
    return await axiosClient.get(url);
  },
};

export default gamificationApi;