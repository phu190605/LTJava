import axiosClient from './axiosClient';

export interface StreakStats {
    currentStreak: number;
    maxStreak: number;
    lastPracticeDate: string | null;
    totalXp: number;
}

export const getStreakStats = async (userId: number): Promise<StreakStats> => {
    return axiosClient.get(`/gamification/stats/${userId}`);
};
