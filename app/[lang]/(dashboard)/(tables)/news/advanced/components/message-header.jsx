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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

const schema = z.object({
  reason: z.string().min(1, { message: "Reason is required" }),
});

const MessageHeader = ({
  showInfo,
  handleShowInfo,
  profile,
  mblChatHandler,
  sosId,
}) => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  let active = true;
  const isLg = useMediaQuery("(max-width: 1024px)");
  const [isOpenDialog, setIsOpenDialog] = useState(false);

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
      reason: "",
    },
  });

  const submitCloseReport = async () => {
    try {
      const { reason } = getValues();
      const payloads = new FormData();
      payloads.append("message_close", reason);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_STAGING}/api/v1/ticket/closed/${sosId}`,
        payloads,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setIsOpenDialog(false);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

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
            <AvatarImage src={profile?.photo_url} alt="" />
            <AvatarFallback>{profile?.fullname}</AvatarFallback>
          </Avatar>
          <Badge
            className=" h-3 w-3  p-0 ring-1 ring-border ring-offset-[1px]   items-center justify-center absolute left-[calc(100%-12px)] top-[calc(100%-12px)]"
            color={active ? "success" : "secondary"}
          ></Badge>
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-default-900 ">
            <span className="relative">{profile?.fullname}</span>
          </div>
          <span className="text-xs text-default-500">
            {active ? "Active Now" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex-none space-x-2 rtl:space-x-reverse">
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
          <Button onClick={() => setIsOpenDialog(true)}>Close Report</Button>
          <DialogContent size="xs">
            <form onSubmit={handleSubmit(submitCloseReport)}>
              <DialogHeader>
                <DialogTitle className="text-base font-medium text-default-700 max-w-[230px] ">
                  Add Reason
                </DialogTitle>
              </DialogHeader>

              <div className="text-sm text-default-500 space-y-2 mt-4">
                <Input
                  type="text"
                  {...register("reason")}
                  id="reason"
                  className={cn("", {
                    "border-destructive": errors.reason,
                  })}
                  placeholder="Report is solved..."
                />
                {errors.reason && (
                  <div className="text-xs text-destructive">
                    {errors.reason.message}
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default MessageHeader;
