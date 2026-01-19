import axiosClient from "./axiosClient";
import type { LearningMaterial } from "../types/mentor";
import type { User } from "../types/user";

/* ======================
   TYPES
====================== */
export interface Skill {
  id: number;
  name: string;
}

export interface Mentor {
  id: number;
  fullName: string;
  email: string;
  skills?: Skill[];
}

/* ======================
   📊 DASHBOARD
====================== */
export const getDashboardStats = async (): Promise<any> => {
  return axiosClient.get("/mentor/dashboard");
};

/* ======================
   📝 ASSESSMENT
====================== */
export const getPendingAssessments = async (): Promise<any[]> => {
  return axiosClient.get("/mentor/assessment/pending");
};

export const getAssessmentDetail = async (id: string): Promise<any> => {
  return axiosClient.get(`/mentor/assessment/${id}`);
};

export const submitAssessmentLevel = async (
  id: string,
  level: string,
  comment: string
): Promise<any> => {
  return axiosClient.post(`/mentor/assessment/${id}/assign`, {
    level,
    comment,
  });
};

/* ======================
   🎧 EXERCISE
====================== */
export const getPendingExercises = async (): Promise<any[]> => {
  return axiosClient.get("/mentor/exercise/pending");
};

export const getExerciseDetail = async (id: string): Promise<any> => {
  return axiosClient.get(`/mentor/exercise/${id}`);
};

export const submitExerciseFeedback = async (
  id: string,
  mistake: string,
  correction: string,
  tag: string,
  time: number
): Promise<any> => {
  return axiosClient.post(`/mentor/exercise/${id}/feedback`, {
    mistake,
    correction,
    tag,
    time,
  });
};

/* ======================
   📂 MATERIALS
====================== */
export const getAllMaterials = async (): Promise<LearningMaterial[]> => {
  return axiosClient.get("/mentor/materials");
};

export const uploadMaterial = async (
  file: File,
  title: string,
  mentorId: number
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("mentorId", mentorId.toString());

  return axiosClient.post("/mentor/materials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================
   👤 PROFILE
====================== */
export const getMentorProfile = async (): Promise<User> => {
  return axiosClient.get("/mentor/profile");
};

export const updateMentorProfile = async (data: any): Promise<User> => {
  return axiosClient.put("/mentor/profile", data);
};

export const uploadAvatar = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosClient.post("/mentor/profile/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadCertificate = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosClient.post("/mentor/profile/upload-certificate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
/* ======================
   ADMIN – MENTOR (❌ KHÔNG ĐỤNG)
====================== */
export const createMentor = async (
  data: CreateMentorRequest
): Promise<Mentor> => {
  return axiosClient.post("/admin/mentors", data);
};

export const getAllMentors = async (): Promise<Mentor[]> => {
  return axiosClient.get("/admin/mentors");
};

export const getAllSkills = async (): Promise<Skill[]> => {
  return axiosClient.get("/admin/skills");
};

export const assignSkillsToMentor = async (
  mentorId: number,
  skills: string[]
): Promise<void> => {
  await axiosClient.post("/admin/mentors/assign-skills", {
    mentorId,
    skills,
  });
};

export const deleteMentor = async (mentorId: number): Promise<void> => {
  await axiosClient.delete(`/admin/mentors/${mentorId}`);
};

export const removeSkillFromMentor = async (
  mentorId: number,
  skillId: number
): Promise<void> => {
  await axiosClient.delete(
    `/admin/mentors/${mentorId}/skills/${skillId}`
  );
};