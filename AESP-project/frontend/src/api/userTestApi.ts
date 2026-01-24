import axiosClient from "./axiosClient";

export const checkHasTested = async (): Promise<boolean> => {
    // Giả định backend trả về { hasTested: true/false }
    const res = await axiosClient.get("/profile/has-tested");
    return !!res?.hasTested;
};
