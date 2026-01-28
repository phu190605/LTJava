import axiosClient from "./axiosClient";

export interface User {
  id: number;
}

export interface Mentor {
  id: number;
}

export interface Skill {
  id: number;
}


export const getAdminUsers = (): Promise<User[]> => {
  return axiosClient.get("/admin/users");
};

export const getAdminMentors = (): Promise<Mentor[]> => {
  return axiosClient.get("/admin/mentors");
};

export const getAdminSkills = (): Promise<Skill[]> => {
  return axiosClient.get("/admin/skills");
};
