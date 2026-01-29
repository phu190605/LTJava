import axiosClient from "./axiosClient";

export const checkHasTested = async (): Promise<boolean> => {
    const res: any = await axiosClient.get("/profile/has-tested");
    return !!res.hasTested;
};

