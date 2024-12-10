"use client";
import * as React from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { data } from "../../news/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import card1 from "@/public/images/card/dummy-photo.jpeg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MessageHeader from "../../news/advanced/components/message-header";
import SearchMessages from "../../news/advanced/components/contact-info/search-messages";
// import MyProfileHeader from "./my-profile-header";
import EmptyMessage from "../../news/advanced/components/empty-message";
import Messages from "../../news/advanced/components/messages";
import Loader from "../../news/advanced/components/loader";
import { isObjectNotEmpty } from "@/lib/utils";
import PinnedMessages from "../../news/advanced/components/pin-messages";
// import ForwardMessage from "./forward-message";
import ContactInfo from "../../news/advanced/components/contact-info";
import { useMediaQuery } from "@/hooks/use-media-query";
// import { cn } from "@/lib/utils";
import {
  getContacts,
  getMessages,
  getProfile,
  sendMessage,
  deleteMessage,
  getMessagesDefault,
} from "../../news/advanced/components/chat-config";
import MessageFooter from "../../news/advanced/components/message-footer";
import Player from "next-video/player";
import socketIO from "socket.io-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { getSocket } from "@/config/socket-io";
import { toast as sonnerToast } from "sonner";

export function ChatPage() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [selectedChatId, setSelectedChatId] = React.useState(null);
  const [showContactSidebar, setShowContactSidebar] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const queryClient = useQueryClient();
  const getMessagesDefaultCallback = React.useCallback(
    (chatData) => getMessagesDefault(chatData),
    []
  );
  const getMessagesCallback = React.useCallback(
    (sosId) => getMessages({ sosId }),
    []
  );
  const [replay, setReply] = React.useState(false);
  const [replayData, setReplyData] = React.useState({});
  const [isShowInputMessage, setIsShowInputMessage] = React.useState(true);
  const [isOpenSearch, setIsOpenSearch] = React.useState(false);
  const [pinnedMessages, setPinnedMessages] = React.useState([]);
  const [isForward, setIsForward] = React.useState(false);
  const router = useRouter();
  // const { name } = router.query;
  const searchParams = useSearchParams();
  const sosId = searchParams.get("id");
  const ws = React.useRef(null);
  const pingInterval = React.useRef(null);
  const [endSessionBtnText, setEndSessionBtnText] =
    React.useState("Close Report");
  const socket = getSocket();

  const {
    isLoading,
    isError,
    data: contacts,
    error,
    refetch: refetchContact,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
    keepPreviousData: true,
  });

  const {
    isLoading: messageLoading,
    isError: messageIsError,
    data: chats,
    error: messageError,
    refetch: refetchMessage,
  } = useQuery({
    queryKey: ["message"],
    queryFn: () => getMessagesCallback(sosId),
    keepPreviousData: true,
  });

  const sendMessageWS = (message) => {
    try {
      socket.emit("send:ticketMessage", {
        ticket_id: sosId,
        message: message,
        sender: chats.Staff,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const messageMutation = useMutation({
    mutationFn: refetchMessage,
    onSuccess: () => {
      // refetchMessage();
      // queryClient.invalidateQueries("messages");
    },
  });

  React.useEffect(() => {
    socket.on("listen:ticketMessage", (data) => {
      console.log(data);
      messageMutation.mutate(data);
    });
  }, []);

  React.useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join:ticketRoom", sosId);
    });
  }, []);

  const handleSendMessage = (message) => {
    if (!message) return;

    sendMessageWS(message);
  };

  const chatHeightRef = React.useRef(null);

  // replay message
  const handleReply = (data, contact) => {
    const newObj = {
      message: data,
      contact,
    };
    setReply(true);
    setReplyData(newObj);
  };

  React.useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [handleSendMessage]);

  React.useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [pinnedMessages]);

  const handlePinMessage = (note) => {
    const updatedPinnedMessages = [...pinnedMessages];

    const existingIndex = updatedPinnedMessages.findIndex(
      (msg) => msg.note === note.note
    );

    if (existingIndex !== -1) {
      updatedPinnedMessages.splice(existingIndex, 1); // Remove the message
      //setIsPinned(false);
    } else {
      updatedPinnedMessages.push(note); // Add the message
      // setIsPinned(true);
    }

    setPinnedMessages(updatedPinnedMessages);
  };

  const handleUnpinMessage = (pinnedMessage) => {
    // Create a copy of the current pinned messages array
    const updatedPinnedMessages = [...pinnedMessages];

    // Find the index of the message to unpin in the updatedPinnedMessages array
    const index = updatedPinnedMessages.findIndex(
      (msg) =>
        msg.note === pinnedMessage.note && msg.avatar === pinnedMessage.avatar
    );

    if (index !== -1) {
      // If the message is found in the array, remove it (unpin)
      updatedPinnedMessages.splice(index, 1);
      // Update the state with the updated pinned messages array
      setPinnedMessages(updatedPinnedMessages);
    }
  };

  // Forward handle
  const handleForward = () => {
    setIsForward(!isForward);
  };

  React.useEffect(() => {
    socket.emit("join:ticketRoom", sosId);

    return () => {
      socket.emit("leave:ticketRoom", sosId);
    };
  }, []);

  React.useEffect(() => {
    socket.on("listen:ticketClosed", (data) => {
      console.log(data, "data resolved");
      setIsShowInputMessage(
        !data.status === "Closed" || !data.status === "Resolved"
      );
      sonnerToast.warning(
        `Sesi chat anda telah ${
          data.status === "Resolved" ? "diakhiri oleh user" : "berakhir"
        }, setelah 3 detik anda akan diarahkan ke halaman utama`
      );
      setTimeout(() => {
        router.push("/list-reporting");
      }, "3000");
    });
  }, []);

  React.useState(() => {
    socket.on("listen:");
  }, []);

  return (
    <>
      <div className="flex-1">
        <div className="flex space-x-5 h-full rtl:space-x-reverse">
          <div className="flex-1">
            <Card className="h-full flex flex-col ">
              <CardHeader className="flex-none mb-0">
                {sosId ? (
                  <MessageHeader
                    showInfo={showInfo}
                    profile={chats?.User?.profile}
                    mblChatHandler={() =>
                      setShowContactSidebar(!showContactSidebar)
                    }
                    sosId={sosId}
                  />
                ) : (
                  <MessageHeader
                    showInfo={showInfo}
                    profile={chats?.User?.profile}
                    mblChatHandler={() =>
                      setShowContactSidebar(!showContactSidebar)
                    }
                  />
                )}
              </CardHeader>

              <CardContent className="!p-0 relative flex-1 overflow-y-auto">
                <div
                  className="h-full py-4 overflow-y-auto no-scrollbar"
                  ref={chatHeightRef}
                >
                  {messageLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {messageIsError ? (
                        <EmptyMessage />
                      ) : (
                        chats?.messages?.map((message, i) => (
                          <Messages
                            key={`message-list-${i}`}
                            message={message}
                            contact={chats?.User?.profile}
                            profile={chats?.User?.profile}
                            index={i}
                            selectedChatId={selectedChatId}
                            handleReply={handleReply}
                            replayData={replayData}
                            handleForward={handleForward}
                            handlePinMessage={handlePinMessage}
                            pinnedMessages={pinnedMessages}
                          />
                        ))
                      )}
                    </>
                  )}
                  <PinnedMessages
                    pinnedMessages={pinnedMessages}
                    handleUnpinMessage={handleUnpinMessage}
                  />
                </div>
              </CardContent>
              {isShowInputMessage && (
                <CardFooter className="flex-none flex-col px-0 py-4 border-t border-border">
                  <MessageFooter
                    handleSendMessage={handleSendMessage}
                    replay={replay}
                    setReply={setReply}
                    replayData={replayData}
                  />
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
