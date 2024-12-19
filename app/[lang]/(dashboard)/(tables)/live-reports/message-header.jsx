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
import { messagesTemplate } from "@/utils/messages-template";

const schema = z.object({
  textMessage: z.string().min(1, { message: "Message is required" }),
});

const MessageHeader = ({
  showInfo,
  handleShowInfo,
  mblChatHandler,
  reportDetailData,
  setSelectedReportId,
  refetchReports,
}) => {
  const userAuth = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  let active = true;
  const { id: reportId, User: user, status } = reportDetailData;
  const isLg = useMediaQuery("(max-width: 1024px)");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const socket = getSocket();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      textMessage: "",
    },
  });

  const submitCloseReport = async (messageValue) => {
    try {
      const payloads = new FormData();
      payloads.append("message_close", messageValue);

      await api.post(`/ticket/closed/${reportId}`, payloads, {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      });

      setIsOpenDialog(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCustomSubmit = (data) => {
    const { textMessage } = data;
    submitCloseReport(textMessage);
  };

  return (
    <div className="flex  items-center">
      <div className="flex flex-1 gap-3 items-center">
        {isLg && (
          <Menu
            className="h-5 w-5 cursor-pointer text-default-600"
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
          {/* <Badge
            className="h-3 w-3  p-0 ring-1 ring-border ring-offset-[1px]   items-center justify-center absolute left-[calc(100%-12px)] top-[calc(100%-12px)]"
            color={active ? "success" : "secondary"}
          ></Badge> */}
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-default-900 ">
            <span className="relative capitalize">
              {user?.profile?.fullname}
            </span>
          </div>
          <span
            className={`text-xs ${
              status === "Open" ? "text-orange-400" : "text-green-600"
            }`}
          >
            {status === "Open" ? "Belum Ditangani" : "Sedang Ditangani"}
          </span>
        </div>
      </div>
      <div className="flex space-x-2 rtl:space-x-reverse">
        {status === "In Progress" && (
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
                  onClick={handleShowInfo}
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
        )}
        {status === "In Progress" && (
          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <Button onClick={() => setIsOpenDialog(true)}>Close Report</Button>
            <DialogContent size="3xl">
              <form onSubmit={handleSubmit(handleCustomSubmit)}>
                <DialogHeader>
                  <DialogTitle className="text-base font-medium text-default-700 max-w-[230px] ">
                    Say Something
                  </DialogTitle>
                </DialogHeader>

                <div className="text-sm text-default-500 space-y-2 mt-4">
                  <Textarea
                    type="text"
                    {...register("textMessage")}
                    id="textMessage"
                    className={cn("", {
                      "border-destructive": errors.textMessage,
                    })}
                    placeholder="Report is solved..."
                    rows="5"
                  />
                  {errors.textMessage && (
                    <div className="text-xs text-destructive">
                      {errors.textMessage.message}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {messagesTemplate?.map((message, idx) => (
                      <Button
                        type="button"
                        key={idx}
                        className="rounded-full text-xs"
                        variant="outline"
                        onClick={() => submitCloseReport(message.text)}
                      >
                        {message.text}
                      </Button>
                    ))}
                  </div>
                </div>
                <DialogFooter className="mt-8">
                  <DialogClose asChild>
                    <Button variant="outline" color="warning">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button className="text-sm" type="submit">
                    Close Report
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;
