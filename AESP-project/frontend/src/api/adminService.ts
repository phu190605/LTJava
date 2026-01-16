import axiosClient from "./axiosClient";
import type { AdminProfile } from "../types/AdminProfile"

export const getAdminProfile = async (): Promise<AdminProfile> => {
  return axiosClient.get("/admin/profile"); 
};

export const updateAdminProfile = (fullName: string) => {
  return axiosClient.put("/admin/profile", { fullName });
};
export interface AdminReport {
  packageName: string;
  totalSold: number;
  totalRevenue: number;
}

export const getAdminReport = async (): Promise<AdminReport[]> => {
  return axiosClient.get("/admin/report");
};
