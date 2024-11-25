import React, { useState } from "react";
import { formatTime } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Undo2 } from "lucide-react";
import Image from "next/image";
import { CheckCheck, Check } from "lucide-react";
import defaultUser from "@/public/images/avatar/default-user.png";

const chatAction = [
  {
    label: "Remove",
    link: "#",
  },
  {
    label: "Forward",
    link: "#",
  },
];

const Messages = ({
  message,
  contact,
  profile,
  onDelete,
  index,
  selectedChatId,
  handleReply,
  replayData,
  handleForward,

  handlePinMessage,
  pinnedMessages,
}) => {
  const {
    chat_id: chatId,
    text: chatMessage,
    sent_time: time,
    user,
    is_read: isRead,
  } = message;
  const { avatar } = contact;
  // State to manage pin status
  const isMessagePinned = pinnedMessages.some(
    (pinnedMessage) => pinnedMessage.index === index
  );

  console.log(avatar, profile.avatar, "avatar", message);

  const handlePinMessageLocal = (note) => {
    const obj = {
      note,
      avatar,
      index,
    };
    handlePinMessage(obj);
  };
  return (
    <>
      <div className="block md:px-6 px-0 ">
        {user.is_me ? (
          <>
            {/* {replayMetadata === true && (
              <div className="w-max ml-auto -mb-2 mr-10">
                <div className="flex items-center gap-1 mb-1">
                  <Undo2 className="w-4 h-4 text-default-600" />{" "}
                  <span className="text-xs text-default-700">
                    You replied to
                    <span className="ml-1 text-default-800">
                      {replayData?.contact?.fullName}
                    </span>
                  </span>
                </div>
                <p className="truncate text-sm bg-default-200 rounded-2xl px-3 py-2.5">
                  {replayData?.message}
                </p>
              </div>
            )} */}
            <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse mb-4">
              <div className=" flex flex-col  gap-1">
                <div className="flex items-center gap-1">
                  {/* <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="w-7 h-7 rounded-full bg-default-200 flex items-center justify-center">
                          <Icon
                            icon="bi:three-dots-vertical"
                            className="text-lg"
                          />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-20 p-0"
                        align="center"
                        side="top"
                      >
                        <DropdownMenuItem
                          onClick={() => onDelete(selectedChatId, index)}
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>Forward</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div> */}
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
                  {time}
                </span>
              </div>
              <div className="flex-none self-end -translate-y-5">
                <div className="h-8 w-8 rounded-full ">
                  <Image
                    src={
                      profile?.avatar === "-" ? defaultUser : profile?.avatar
                    }
                    alt={avatar === "-" ? "" : avatar}
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
                  src={avatar === "-" ? defaultUser : avatar}
                  alt={avatar === "-" ? "" : avatar}
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
                    {isMessagePinned && (
                      <Icon
                        icon="ion:pin-sharp"
                        className=" w-5 h-5 text-destructive  absolute left-0 -top-3 z-[-1]  transform -rotate-[30deg]"
                      />
                    )}

                    <div className="bg-default-200  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                      {chatMessage}
                    </div>
                  </div>
                  {/* <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="w-7 h-7 rounded-full bg-default-200 flex items-center justify-center">
                          <Icon
                            icon="bi:three-dots-vertical"
                            className="text-lg"
                          />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-20 p-0"
                        align="center"
                        side="top"
                      >
                        <DropdownMenuItem
                          onClick={() => onDelete(selectedChatId, index)}
                        >
                          Remove
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReply(chatMessage, contact)}
                        >
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePinMessageLocal(chatMessage)}
                        >
                          {isMessagePinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleForward(chatMessage)}
                        >
                          Forward
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div> */}
                </div>
                <span className="text-xs text-default-500">{time}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
