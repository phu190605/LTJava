
import axiosClient from "./axiosClient";
import type { Mentor } from "./mentorPublicApi";

export interface PlacementResult {
    levelBefore?: string;
    levelAfter?: string;
    mentorNote?: string;
}

export const getPlacementResult = async (): Promise<PlacementResult | null> => {
    try {
        return await axiosClient.get("/learner/mentor/placement-result");
    } catch {
        return null;
    }
};

export const selectMentor = (mentorId: number) => {
    return axiosClient.post(`/learner/mentor/select/${mentorId}`);
};

export const clearSelectedMentor = () => {
    return axiosClient.delete("/learner/mentor/clear");
};

export const getSelectedMentor = async (): Promise<Mentor | null> => {
    try {
        return await axiosClient.get("/learner/mentor/selected");
    } catch {
        return null;
    }
};