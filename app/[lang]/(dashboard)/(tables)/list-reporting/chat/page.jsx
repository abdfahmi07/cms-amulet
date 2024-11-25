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

export function ChatPage() {
  const [rows, setRows] = React.useState([]);
  const [socket, setSocket] = React.useState(null);
  const [confirmSOSData, setConfirmSOSData] = React.useState({});
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [selectedChatId, setSelectedChatId] = React.useState(null);
  const [showContactSidebar, setShowContactSidebar] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const queryClient = useQueryClient();
  const getMessagesCallback = React.useCallback(
    (chatData) => getMessagesDefault(chatData),
    []
  );
  const [replay, setReply] = React.useState(false);
  const [replayData, setReplyData] = React.useState({});
  const [isOpenSearch, setIsOpenSearch] = React.useState(false);
  const [pinnedMessages, setPinnedMessages] = React.useState([]);
  const [isForward, setIsForward] = React.useState(false);
  // const router = useRouter();
  // const { name } = router.query;
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const senderId = searchParams.get("sender");

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
    queryKey: ["message", chatId, senderId],
    queryFn: () => getMessagesCallback({ chatId, senderId }),
    keepPreviousData: true,
  });

  const sendMessageWS = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "message",
          chat_id: chatId,
          sender: user.user.id,
          recipient: senderId,
          text: message,
        })
      );
    }
  };

  const messageMutation = useMutation({
    mutationFn: sendMessageWS,
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
    },
  });

  const onDelete = (selectedChatId, index) => {
    const obj = { selectedChatId, index };
    deleteMutation.mutate(obj);

    // Remove the deleted message from pinnedMessages if it exists
    const updatedPinnedMessages = pinnedMessages.filter(
      (msg) => msg.selectedChatId !== selectedChatId && msg.index !== index
    );

    setPinnedMessages(updatedPinnedMessages);
  };

  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };

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
  }, [handleSendMessage, contacts]);

  React.useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [pinnedMessages]);

  // handle search bar

  const handleSetIsOpenSearch = () => {
    setIsOpenSearch(!isOpenSearch);
  };
  // handle pin note

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

  const join = (socket) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "join",
          user_id: user.user.id,
        })
      );
    }
  };

  React.useEffect(() => {
    const connectWs = () => {
      const ws = new WebSocket("wss://websockets-rakhsa.inovatiftujuh8.com");

      ws.onopen = () => {
        console.log("Connected to WebSocket");
        setSocket(ws);
        join(ws);
      };

      ws.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        console.log(parsedData);
        if (parsedData.type === "sos") {
          setRows((prevRows) => [
            ...prevRows,
            {
              id: parsedData.id,
              location: parsedData.location,
              time: parsedData.time,
              lat: parsedData.lat,
              lng: parsedData.lng,
              country: parsedData.country,
              media: parsedData.media,
              is_confirm: false,
              sender: {
                id: "-",
                name: parsedData.username,
              },
              type: parsedData.media_type,
              agent: {
                id: "-",
                name: "-",
                kbri: {
                  continent: {
                    name: "-",
                  },
                },
              },
            },
          ]);
        }

        if (parsedData.type === "confirm-sos") {
          // setIsConfirmReport(parsedData.is_confirm);
          setConfirmSOSData(parsedData);
          queryClient.fetchQuery(["message"], () =>
            getMessagesCallback(parsedData)
          );
        }

        if (parsedData.type === "message") {
          messageMutation.mutate(parsedData);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connectWs();

    // return () => {
    //   connectWs();
    // };
  }, []);

  return (
    <>
      <div className="flex-1 ">
        <div className="flex space-x-5 h-full rtl:space-x-reverse">
          <div className="flex-1">
            <Card className="h-full flex flex-col ">
              <CardHeader className="flex-none mb-0">
                <MessageHeader
                  showInfo={showInfo}
                  handleShowInfo={handleShowInfo}
                  profile={chats?.recipient}
                  mblChatHandler={() =>
                    setShowContactSidebar(!showContactSidebar)
                  }
                />
              </CardHeader>
              {isOpenSearch && (
                <SearchMessages handleSetIsOpenSearch={handleSetIsOpenSearch} />
              )}

              <CardContent className=" !p-0 relative flex-1 overflow-y-auto">
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
                        chats?.messages
                          ?.slice()
                          ?.reverse()
                          ?.map((message, i) => (
                            <Messages
                              key={`message-list-${i}`}
                              message={message}
                              contact={chats?.recipient}
                              profile={chats?.recipient}
                              onDelete={onDelete}
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
              {/* <CardFooter className="flex-none flex-col px-0 py-4 border-t border-border">
                <MessageFooter
                  handleSendMessage={handleSendMessage}
                  replay={replay}
                  setReply={setReply}
                  replayData={replayData}
                />
              </CardFooter> */}
            </Card>
          </div>

          {showInfo && (
            <ContactInfo
              handleSetIsOpenSearch={handleSetIsOpenSearch}
              handleShowInfo={handleShowInfo}
              contact={contacts?.contacts?.find(
                (contact) => contact.id === selectedChatId
              )}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ChatPage;