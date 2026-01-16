import axiosClient from "./axiosClient";

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

export const createMentor = (data: CreateMentorRequest): Promise<Mentor> => {
  return axiosClient.post("/admin/mentors", data);
};

export const getAllMentors = (): Promise<Mentor[]> => {
  return axiosClient.get("/admin/mentors");
};

export const getAllSkills = (): Promise<Skill[]> => {
  return axiosClient.get("/admin/skills");
};

export const assignSkillsToMentor = (
  mentorId: number,
  skills: string[]
): Promise<void> => {
  return axiosClient.post("/admin/mentors/assign-skills", {
    mentorId,
    skills,
  });
};

export const deleteMentor = (mentorId: number): Promise<void> => {
  return axiosClient.delete(`/admin/mentors/${mentorId}`);
};

export const removeSkillFromMentor = (
  mentorId: number,
  skillId: number
): Promise<void> => {
  return axiosClient.delete(`/admin/mentors/${mentorId}/skills/${skillId}`);
};
