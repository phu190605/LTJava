import axiosClient from "./axiosClient";

export interface Skill {
    id: number;
    name: string;
}

export interface Mentor {
    id: number;
    fullName: string;
    email: string;

    avatarUrl?: string;
    bio?: string;

    skills: Skill[];
}

export const getAllMentors = async (): Promise<Mentor[]> => {
    return await axiosClient.get("/public/mentors");
};
