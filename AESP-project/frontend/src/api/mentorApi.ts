import axiosClient from "./axiosClient";

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
