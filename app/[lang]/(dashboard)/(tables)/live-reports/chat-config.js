"use client";

import { api } from "@/config/axios.config";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const getReports = async () => {
  const { data } = await api.get("/ticket/admin", {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return data.data;
};

export const getReportDetail = async (reportId) => {
  const { data } = await api.get(`/ticket/messages/${reportId}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return data.data;
};

export const getMessages = async (reportId) => {
  try {
    const { data } = await api.get(`/ticket/messages/${reportId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return data.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const deleteMessage = async (obj) => {
  console.log("Object to be sent:", obj); // Add this log statement
  try {
    await api.delete(`/chat/messages/${obj.selectedChatId}`, { data: obj });
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully (e.g., display an error message to the user)
  }
};

export const sendMessage = async (msg) => {
  const response = await api.post("/chat/messages", msg);
  return response.data;
};
