import React, { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { CheckCheck, Check } from "lucide-react";
import moment from "moment";
import defaultUser from "@/public/images/avatar/default-user.png";
import { getSocket } from "@/config/socket-io";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/config/axios.config";

const Messages = ({
  message,
  contact,
  onDelete,
  index,
  selectedReportId,
  handleReply,
  replayData,
  handleForward,
  handlePinMessage,
  pinnedMessages,
  messageMutation,
  selectedReportStatus,
  refetchReports,
  setSelectedReportId,
}) => {
  const {
    message: chatMessage,
    created_at: time,
    sender_id: senderId,
    is_read: isRead = true,
    read_at: readAt,
  } = message;
  const { photo_url: avatar } = contact;
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const socket = getSocket();

  // useEffect(() => {
  //   socket.on("listen:ticketMessage", (data) => {
  //     console.log(data);
  //     messageMutation.mutate(data);
  //   });
  // }, [selectedReportStatus, selectedReportId]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join:ticketRoom", selectedReportId);
    });
  }, []);

  useEffect(() => {
    socket.emit("join:ticketRoom", selectedReportId);
    return () => {
      socket.emit("leave:ticketRoom", selectedReportId);
    };
  }, []);

  // const readMessages = async () => {
  //   try {
  //     const { data } = await api.post(
  //       `/ticket/read/${selectedReportId}/messages`,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${user.token}` },
  //       }
  //     );

  //     refetchReports();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   if (!readAt) {
  //     readMessages();
  //   }
  // }, []);

  // useEffect(() => {
  //   socket.on("listen:ticketClosed", (data) => {
  //     setSelectedReportId(null);
  //     refetchReports();
  //   });
  // }, []);

  return (
    <>
      <div className="block md:px-6 px-0">
        {senderId === user.id ? (
          <>
            <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse mb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <div className="whitespace-pre-wrap break-all">
                    <div className="bg-primary/70 text-primary-foreground  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                      {chatMessage}{" "}
                      {isRead ? (
                        <CheckCheck color="blue" size={18} />
                      ) : (
                        <Check color="grey" size={18} />
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-end text-default-500">
                  {moment(time).format("HH:mm")}
                </span>
              </div>
              <div className="flex-none self-end -translate-y-5">
                <div className="h-8 w-8 rounded-full ">
                  <Image
                    src={!avatar ? defaultUser : avatar}
                    alt={!avatar ? "" : avatar}
                    className="block w-full h-full object-cover rounded-full"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex space-x-2 items-start group rtl:space-x-reverse mb-4">
            <div className="flex-none self-end -translate-y-5">
              <div className="h-8 w-8 rounded-full">
                <Image
                  src={!avatar ? defaultUser : avatar}
                  alt={!avatar ? "" : avatar}
                  className="block w-full h-full object-cover rounded-full"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-col   gap-1">
                <div className="flex items-center gap-1">
                  <div className="whitespace-pre-wrap break-all relative z-[1]">
                    <div className="bg-default-200  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                      {chatMessage}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-default-500">
                  {moment(time).format("HH:mm")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
