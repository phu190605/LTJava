import axiosClient from "./axiosClient";

export interface CreateMentorRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface AssignSkillsRequest {
    mentorId: number;
    skills: string[];
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
