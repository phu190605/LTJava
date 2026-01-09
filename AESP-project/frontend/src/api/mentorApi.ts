import axiosClient from "./axiosClient";
import type { LearningSession,LearningMaterial,Feedback } from "../types/mentor";

export interface CreateMentorRequest {
    fullName: string;
    email: string;
    password: string;
}

export const createMentor = (data: CreateMentorRequest) => {
    return axiosClient.post("/admin/mentors", data);
};

export const getAllMentors = () => {
    return axiosClient.get("/admin/mentors");
};

export const getAllSkills = () => {
    return axiosClient.get("/admin/skills");
};

export const assignSkillsToMentor = (mentorId: number, skills: string[]) => {
    return axiosClient.post("/admin/mentors/assign-skills", {
        mentorId,
        skills
    });
};

export const deleteMentor = (mentorId: number) => {
    return axiosClient.delete(`/admin/mentors/${mentorId}`);
};

export const removeSkillFromMentor = (mentorId: number, skillId: number) => {
    return axiosClient.delete(`/admin/mentors/${mentorId}/skills/${skillId}`);
};
export const getSessionsForMentor = (mentorId: string) => {
  return axiosClient.get<LearningSession[]>(
    `/mentor/sessions/${mentorId}`
  );
};
export const submitFeedback = (data: Feedback) => {
  return axiosClient.post<Feedback>(
    "/mentor/feedback",
    data
  );
};

export const getFeedbackBySession = (sessionId: string) => {
  return axiosClient.get<Feedback[]>(
    `/mentor/feedback/${sessionId}`
  );
};
export const getAllMaterials = () => {
  return axiosClient.get<LearningMaterial[]>(
    "/mentor/materials"
  );
};

export const uploadMaterial = (
  file: File,
  title: string,
  mentorId: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("mentorId", mentorId);

  return axiosClient.post<LearningMaterial>(
    "/mentor/materials",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

