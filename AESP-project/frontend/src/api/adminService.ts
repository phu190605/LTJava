import axiosClient from "./axiosClient";

export const getAdminProfile = () => {
  return axiosClient.get("/admin/profile");
};
