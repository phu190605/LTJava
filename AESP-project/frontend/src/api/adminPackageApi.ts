import axiosClient from "./axiosClient";

export const getAdminPackages = () =>
  axiosClient.get("/admin/service-packages");

export const createAdminPackage = (data: any) =>
  axiosClient.post("/admin/service-packages", data);

export const updateAdminPackage = (id: number, data: any) =>
  axiosClient.put(`/admin/service-packages/${id}`, data);

export const deleteAdminPackage = (id: number) =>
  axiosClient.delete(`/admin/service-packages/${id}`);
