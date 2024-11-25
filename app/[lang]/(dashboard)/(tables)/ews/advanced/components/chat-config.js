import { api } from "@/config/axios.config";
import axios from "axios";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const getContacts = async () => {
  const response = await api.get("/chat");
  return response.data;
};

export const getMessages = async (data) => {
  try {
    const { chat_id, recipient_id, is_confirm } = data;
    const response = await axios.post(
      `https://api-rakhsa.inovatiftujuh8.com/api/v1/chat/messages`,
      {
        chat_id,
        sender_id: user.user.id,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    console.log("Response from getMessages:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getMessagesDefault = async (data) => {
  try {
    const { chatId, senderId } = data;
    const response = await axios.post(
      `https://api-rakhsa.inovatiftujuh8.com/api/v1/chat/messages`,
      {
        chat_id: chatId,
        sender_id: user.user.id,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    console.log("Response from getMessages:", response.data);
    return response.data.data;
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

export const getProfile = async () => {
  const response = await api.get("/chat/profile-data");

  return response.data;
};

export const sendMessage = async (msg) => {
  const response = await api.post("/chat/messages", msg);
  return response.data;
};
