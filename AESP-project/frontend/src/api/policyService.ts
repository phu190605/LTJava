import axiosClient from "./axiosClient";

export interface SystemPolicy {
  id: number;
  type: "TERMS" | "PRIVACY";
  content: string;
  version: string;
  active: boolean;
}

export const getPolicyByType = async (
  type: "TERMS" | "PRIVACY"
): Promise<SystemPolicy> => {
  return axiosClient.get(`/public/policies/${type}`);
};
