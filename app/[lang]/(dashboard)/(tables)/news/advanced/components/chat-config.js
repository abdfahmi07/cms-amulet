import { api } from "@/config/axios.config";
import axios from "axios";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const getContacts = async () => {
  const response = await api.get("/chat");
  return response.data;
};

export const getMessages = async (payloads) => {
  try {
    const { sosId } = payloads;
    const { data } = await axios.get(
      `http://157.245.193.49:3800/api/v1/ticket/messages/${sosId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    console.log("Response from getMessages:", data.data);
    return data.data;
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
        is_agent: true,
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
