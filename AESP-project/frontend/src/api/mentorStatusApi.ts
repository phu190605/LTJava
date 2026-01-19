import axiosClient from "./axiosClient";

export const getMentorStatus = async () => {
    return axiosClient.get("/subscription/learner/mentor/status");
};
