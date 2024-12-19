"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime } from "@/lib/utils";
import { Icon } from "@iconify/react";
import defaultUser from "@/public/images/avatar/default-user.png";
import moment from "moment";
import { useEffect, useState } from "react";

const ReportList = ({ report, openChat, selectedReportId }) => {
  const [unreadMessages, setUnreadMessages] = useState(null);
  const { id, status, messages, User, user_id: userId } = report;
  const { profile, email, phone } = User || {};
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const reportCreatedAt = report.created_at;
  const messageCreatedAt = messages?.[0]?.created_at;
  const isNotToday = !moment(
    messages?.length === 0 || status === "Open"
      ? reportCreatedAt
      : messageCreatedAt
  ).isSame(moment(), "day");

  // useEffect(() => {
  //   if (messages.length === 0) {
  //     setUnreadMessages(0);
  //   } else {
  //     const filteredUnreadMessages = messages.filter(
  //       (message) => !message.read_at && message.sender_id !== user.id
  //     );
  //     console.log(filteredUnreadMessages, messages, "filter");
  //     setUnreadMessages(filteredUnreadMessages.length);
  //   }
  // }, []);

  return (
    <div
      className={cn(
        "gap-4 py-2 lg:py-2.5 px-3 border-l-2 border-transparent hover:bg-default-200 cursor-pointer flex ",
        {
          "lg:border-primary/70 lg:bg-default-200 ": id === selectedReportId,
        }
      )}
      onClick={() => openChat(id, status, userId)}
    >
      <div className="flex-1 flex  gap-3 ">
        <div className="relative inline-block ">
          <Avatar>
            <AvatarImage src={profile?.photo_url || defaultUser} />
            <AvatarFallback
              className={`uppercase ${
                !report.read_at && report.status === "Open"
                  ? "font-medium"
                  : "font-light"
              }`}
            >
              {profile?.fullname.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {!report.read_at && report.status === "Open" && (
            <Badge
              className="h-2 w-2 p-0 ring-1 ring-border ring-offset-[1px] items-center justify-center absolute
             left-[calc(100%-8px)] top-[calc(100%-10px)] text-[10px]"
              color="warning"
            ></Badge>
          )}
        </div>
        <div className="block">
          <div className="truncate max-w-[120px]">
            <div className="flex gap-x-2">
              <span
                className={`text-sm text-default-900 ${
                  !report.read_at && report.status === "Open"
                    ? "font-medium"
                    : "font-light"
                } capitalize`}
              >
                {" "}
                {profile?.fullname}
              </span>
              {/* <span
                className={cn(
                  "px-2 flex items-center justify-center rounded-md text-primary-foreground text-[8px] font-medium text-primary/70"
                )}
              >
                New
              </span> */}
              {/* {report.isNew &&  <span>
                New
                </span>} */}
            </div>
          </div>
          <div className="truncate max-w-[120px]">
            <span
              className={`text-[11px] ${
                status === "Open" ? "text-orange-400" : "text-green-600"
              } ${
                !report.read_at && report.status === "Open"
                  ? "font-medium"
                  : "font-light"
              }`}
            >
              {status === "Open" ? "Belum Ditangani" : "Sedang Ditangani"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-none flex-col items-end  gap-2 hidden lg:flex">
        <span
          className={`text-xs ${
            !report.read_at && report.status === "Open"
              ? "text-primary font-medium"
              : "text-default-600 font-light"
          } text-end uppercase`}
        >
          {moment(
            messages.length === 0
              ? report?.created_at
              : messages?.[0]?.created_at
          ).format(isNotToday ? "DD/MM/YYYY" : "HH:mm")}
        </span>
        {/* {status === "In Progress" && unreadMessages !== 0 && (
          <span
            className={cn(
              "h-[14px] w-[14px] flex items-center justify-center bg-default-400 rounded-full text-primary-foreground text-[10px] font-medium",
              {
                "bg-primary/70": unreadMessages > 0,
              }
            )}
          >
            {unreadMessages}
          </span>
        )} */}
      </div>
    </div>
  );
};

export default ReportList;
