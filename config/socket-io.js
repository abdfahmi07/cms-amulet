"use client";

import { io } from "socket.io-client";

let socket;
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL_STAGING || "", {
      extraHeaders: {
        Authorization: `${user.token}`,
      },
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Connected to the Socket.IO server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the Socket.IO server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });
  }

  return socket;
};
