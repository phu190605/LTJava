import axiosClient from "./axiosClient";

export const getAllPayments = () =>
  axiosClient.get("/admin/payments");
