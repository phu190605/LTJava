import axiosClient from "./axiosClient";

export const checkHasTested = async (): Promise<boolean> => {
    const res = await axiosClient.get("/profile/has-tested");
    return !!res?.data?.hasTested;
};
