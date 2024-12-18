"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/config/axios.config";
import { getSocket } from "@/config/socket-io";
import { Textarea } from "@/components/ui/textarea";

const MessageHeader = ({ mblChatHandler, reportDetailData }) => {
  const { User: user, status } = reportDetailData;
  const isLg = useMediaQuery("(max-width: 1024px)");

  return (
    <div className="flex  items-center">
      <div className="flex flex-1 gap-3 items-center">
        {isLg && (
          <Menu
            className=" h-5 w-5 cursor-pointer text-default-600"
            onClick={mblChatHandler}
          />
        )}
        <div className="relative inline-block">
          <Avatar>
            <AvatarImage src={user?.profile?.photo_url} alt="" />
            <AvatarFallback className="uppercase">
              {user?.profile?.fullname?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-default-900 ">
            <span className="relative capitalize">
              {user?.profile?.fullname}
            </span>
          </div>
          <span className={`text-xs text-green-600`}>Sudah Diselesaikan</span>
        </div>
      </div>
      {/* <div className="flex space-x-2 rtl:space-x-reverse">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className={cn(
                  "bg-transparent hover:bg-default-50 rounded-full",
                  {
                    "text-primary": !showInfo,
                  }
                )}
                onClick=""
              >
                <span className="text-xl text-primary ">
                  {showInfo ? (
                    <Icon icon="material-symbols:info" />
                  ) : (
                    <Icon icon="material-symbols:info-outline" />
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Detail User</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div> */}
    </div>
  );
};

export default MessageHeader;
