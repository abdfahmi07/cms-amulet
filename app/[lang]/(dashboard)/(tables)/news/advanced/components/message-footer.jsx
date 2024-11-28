"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { Annoyed, SendHorizontal } from "lucide-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MessageFooter = ({ handleSendMessage, replay, setReply, replayData }) => {
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto"; // Reset the height to auto to adjust
    e.target.style.height = `${e.target.scrollHeight - 15}px`;
  };

  const handleSelectEmoji = (emoji) => {
    setMessage(message + emoji.native);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(message);
    setReply(false);
    setMessage("");
  };
  return (
    <>
      {replay && (
        <div className=" w-full px-6 py-4 flex justify-between gap-4 items-center">
          <div>
            <div className="font-semibold text-base text-default-700 mb-1">
              Replying to {replayData?.contact?.fullName}
            </div>
            <div className="truncate">
              <span className="text-sm text-muted-foreground">
                {replayData?.message}
              </span>
            </div>
          </div>
          <span className="cursor-pointer " onClick={() => setReply(false)}>
            <Icon
              icon="heroicons:x-mark-20-solid"
              className="text-2xl text-default-900"
            />
          </span>
        </div>
      )}

      <div
        className="w-full flex items-end gap-1 lg:gap-4 lg:px-4 relative px-2 "
        style={{
          boxSizing: "border-box",
        }}
      >
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="flex  gap-1 relative">
              <textarea
                value={message}
                onChange={handleChange}
                placeholder="Type your message..."
                className="bg-background border border-default-200 outline-none focus:border-primary  rounded-xl break-words pl-8  md:pl-3 px-3 flex-1 h-10 pt-2 p-1 pr-8 no-scrollbar "
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{
                  minHeight: "40px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  resize: "none",
                }}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <span className="absolute ltr:right-12 rtl:left-12 bottom-1.5 h-7 w-7 rounded-full cursor-pointer  ">
                    <Annoyed className="w-6 h-6 text-primary" />
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-fit p-0 shadow-none border-none bottom-0 rtl:left-5 ltr:-left-[110px]"
                >
                  <Picker
                    data={data}
                    onEmojiSelect={handleSelectEmoji}
                    theme="light"
                  />
                </PopoverContent>
              </Popover>
              <Button
                type="submit"
                className="rounded-full bg-default-200 hover:bg-default-300 h-[42px] w-[42px] p-0 self-end"
              >
                <SendHorizontal className="w-5 h-8 text-primary rtl:rotate-180" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MessageFooter;
