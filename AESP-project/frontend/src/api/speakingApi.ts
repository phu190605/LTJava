import axiosClient from "./axiosClient";

export interface SpeakingResult {
    id: number;
    userId: number;
    partNumber: number;
    score: number;
    feedback: string;
    createdAt: string;
}

// Lưu ý: KHÔNG thêm /api ở đầu endpoint vì axiosClient đã có baseURL: http://localhost:8080/api
export const getSpeakingResults = async (userId: number): Promise<SpeakingResult[]> => {
    return axiosClient.get(`/speaking/results?userId=${userId}`);
};
