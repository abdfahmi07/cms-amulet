"use client";

import { api } from "@/config/axios.config";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const getReportDetail = async (reportId) => {
  const { data } = await api.get(`/ticket/messages/${reportId}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  console.log(data.data);
  return data.data;
};
