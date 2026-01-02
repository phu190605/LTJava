import axiosClient from "./axiosClient";

export interface CreateLearningPathRequest {
  learnerId: number;
  goal: string;
  industry: string;
}

export const createLearningPath = (data: CreateLearningPathRequest) => {
  return axiosClient.post("/learning-path", data);
};

export const getLearningPath = (learnerId: number) => {
  return axiosClient.get(`/learning-path/${learnerId}`);
};
