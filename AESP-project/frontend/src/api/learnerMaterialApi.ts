import axiosClient from "./axiosClient";

export interface LearningMaterial {
    id: string;
    title: string;
    type: string;
    fileUrl: string;
    mentorId: string;
}

export const getMyMentorMaterials = async (): Promise<LearningMaterial[]> => {
    return await axiosClient.get("/learner/materials");
};
