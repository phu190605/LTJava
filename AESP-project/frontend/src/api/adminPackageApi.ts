import axiosClient from "./axiosClient";

export const getAdminPackages = () =>
  axiosClient.get("/service-packages");

export const createAdminPackage = (data: any) =>
  axiosClient.post("/service-packages", data);

export const updateAdminPackage = (id: number, data: any) =>
  axiosClient.put(`/service-packages/${id}`, data);

export const deleteAdminPackage = (id: number) =>
  axiosClient.delete(`/service-packages/${id}`);
