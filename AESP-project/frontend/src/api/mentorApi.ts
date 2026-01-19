import axiosClient from "./axiosClient";
import type { LearningMaterial } from "../types/mentor";

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

export interface CreateMentorRequest {
  fullName: string;
  email: string;
  password: string;
}

/* ======================
   📊 DASHBOARD
====================== */
export const getDashboardStats = async (mentorId: string) => {
  const res = await axiosClient.get(`/mentor/dashboard/${mentorId}`);
  return res.data;
};

/* ======================
   📝 ASSESSMENT
====================== */
export const getPendingAssessments = async (mentorId: string) => {
  const res = await axiosClient.get(
    `/mentor/assessment/pending/${mentorId}`
  );
  return res.data;
};

export const getAssessmentDetail = async (id: string) => {
  const res = await axiosClient.get(`/mentor/assessment/${id}`);
  return res.data;
};

export const submitAssessmentLevel = async (
  id: string,
  level: string,
  comment: string
) => {
  const res = await axiosClient.post(
    `/mentor/assessment/${id}/assign`,
    { level, comment }
  );
  return res.data;
};

/* ======================
   ADMIN – MENTOR
====================== */
export const createMentor = async (
  data: CreateMentorRequest
): Promise<Mentor> => {
  return await axiosClient.post("/admin/mentors", data);
};

export const getAllMentors = async (): Promise<Mentor[]> => {
  return await axiosClient.get("/admin/mentors");
};

export const getAllSkills = async (): Promise<Skill[]> => {
  return await axiosClient.get("/admin/skills");
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

/* ======================
   🎧 EXERCISE
====================== */
export const getPendingExercises = async (mentorId: string) => {
  const res = await axiosClient.get(
    `/mentor/exercise/pending/${mentorId}`
  );
  return res.data;
};

export const getExerciseDetail = async (id: string) => {
  const res = await axiosClient.get(`/mentor/exercise/${id}`);
  return res.data;
};

export const getCompletedExercises = async (mentorId: string) => {
  const res = await axiosClient.get(
    `/mentor/exercise/completed/${mentorId}`
  );
  return res.data;
};

export const submitExerciseFeedback = async (
  id: string,
  mistake: string,
  correction: string,
  tag: string,
  time: number
) => {
  const res = await axiosClient.post(
    `/mentor/exercise/${id}/feedback`,
    { mistake, correction, tag, time }
  );
  return res.data;
};

/* ======================
   📂 MATERIALS
====================== */
export const getAllMaterials = async (): Promise<LearningMaterial[]> => {
  const res = await axiosClient.get(`/mentor/materials`);
  return res.data;
};

export const uploadMaterial = async (
  file: File,
  title: string,
  mentorId: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("mentorId", mentorId);

  const res = await axiosClient.post(
    `/mentor/materials`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};

/* ======================
   👤 PROFILE
====================== */
export const getMentorProfile = async (id: string) => {
  const res = await axiosClient.get(`/mentor/profile/${id}`);
  return res.data;
};

export const updateMentorProfile = async (id: string, data: any) => {
  const res = await axiosClient.put(`/mentor/profile/${id}`, data);
  return res.data;
};

export const uploadAvatar = async (
  mentorId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post(
    `/mentor/profile/upload-avatar/${mentorId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};

export const uploadCertificate = async (
  mentorId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post(
    `/mentor/profile/upload-certificate/${mentorId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};
