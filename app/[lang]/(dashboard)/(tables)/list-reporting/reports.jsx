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
import { data } from "../ews/data";
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
import MessageHeader from "../ews/advanced/components/message-header";
import SearchMessages from "../ews/advanced/components/contact-info/search-messages";
import EmptyMessage from "../ews/advanced/components/empty-message";
import Messages from "../ews/advanced/components/messages";
import Loader from "../ews/advanced/components/loader";
import { isObjectNotEmpty } from "@/lib/utils";
import PinnedMessages from "../ews/advanced/components/pin-messages";
import ContactInfo from "../ews/advanced/components/contact-info";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  getContacts,
  getMessages,
  getProfile,
  sendMessage,
  deleteMessage,
} from "../ews/advanced/components/chat-config";
import MessageFooter from "../ews/advanced/components/message-footer";
import Player from "next-video/player";
import socketIO from "socket.io-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          {/* <Avatar className=" rounded-full">
            <AvatarImage src={row?.original?.user.avatar} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar> */}
          <span className="text-sm text-card-foreground whitespace-nowrap">
            {row?.original?.sender?.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{`${row.getValue("time")} WIB`}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
              <DropdownMenuItem>Confirm Accident</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function Reports() {
  const [sorting, setSorting] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  // const [socket, setSocket] = React.useState(null);

  const [confirmSOSData, setConfirmSOSData] = React.useState({});
  const [detailSOS, setDetailSOS] = React.useState({});
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [selectedChatId, setSelectedChatId] = React.useState(null);
  const [showContactSidebar, setShowContactSidebar] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("recent");

  const [showInfo, setShowInfo] = React.useState(false);
  const queryClient = useQueryClient();

  const getMessagesCallback = React.useCallback(
    (confirmSOSData) => getMessages(confirmSOSData),
    []
  );
  const [replay, setReply] = React.useState(false);
  const [replayData, setReplyData] = React.useState({});

  const [isOpenSearch, setIsOpenSearch] = React.useState(false);

  const [pinnedMessages, setPinnedMessages] = React.useState([]);
  const [isForward, setIsForward] = React.useState(false);
  const router = useRouter();

  const ws = React.useRef(null);
  const chatHeightRef = React.useRef(null);
  const pingInterval = React.useRef(null);

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
    queryKey: ["message", confirmSOSData],
    queryFn: () => getMessagesCallback(confirmSOSData),
    keepPreviousData: true,
  });

  // const {
  //   isLoading: profileLoading,
  //   isError: profileIsError,
  //   data: profileData,
  //   error: profileError,
  //   refetch: refetchProfile,
  // } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: () => getProfile(),
  //   keepPreviousData: true,
  // });

  const sendMessageWS = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "message",
          chat_id: confirmSOSData.chat_id,
          sender: user.user.id,
          recipient: confirmSOSData.sender_id,
          text: message,
        })
      );
    }
  };

  const offerToEndChatSession = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "finish-sos",
          sos_id: confirmSOSData.sos_id,
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

  const openChat = (chatId) => {
    setSelectedChatId(chatId);
    setReply(false);
    if (showContactSidebar) {
      setShowContactSidebar(false);
    }
  };

  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleSendMessage = (message) => {
    if (!message) return;

    sendMessageWS(message);
  };

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
  const isLg = useMediaQuery("(max-width: 1024px)");

  // BATAS

  // const table = useReactTable({
  //   data: rows,
  //   columns,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onRowSelectionChange: setRowSelection,
  //   state: {
  //     sorting,
  //     columnFilters,
  //     columnVisibility,
  //     rowSelection,
  //   },
  // });

  // const rowModel = table.getRowModel();

  const getListReporting = async () => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/sos`,
        {
          params: {
            type:
              filterValue === "recent"
                ? "waiting"
                : filterValue === "on_process"
                ? "process"
                : "confirmed",
            platform_type: "amulet",
          },
        }
      );

      setRows(data.data.slice().reverse());
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  React.useEffect(() => {
    getListReporting();
  }, [filterValue]);

  const join = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "join",
          user_id: user.user.id,
        })
      );
    }
  };

  const confirmSOS = (event, sosId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "confirm-sos",
          sos_id: sosId,
          user_agent_id: user.user.id,
        })
      );
    }
  };

  // useEffect(() => {
  //   const newSocket = io("https://api-tentang-voucher.inovatiftujuh8.com/", {
  //     auth: {
  //       token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMsInVzZXJuYW1lIjoiYWJkdWxmYWhtaSIsImVtYWlsIjoiZHVsb2hoaDA4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiMjAyNC0xMC0yMFQyMzo0MjoxMi4wMDBaIiwicGhvbmVfbnVtYmVyIjoiMDgzODc0NDQyNjk2IiwicGFzc3dvcmQiOiIkMmIkMTAkMUJmcHNXU1owYXNsU0dKVmZhbFBVZWtOTTNSZWxEcEtKWi50UFl4blFhTzNON2Z3eUJERi4iLCJvdHAiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKdmRIQWlPaUkxTnpBeElpd2lhV0YwSWpveE56TXdNVGsxT0RJNUxDSmxlSEFpT2pFM016QXhPVFl3TURsOS5oT25zWmlIckNtSjRQN3BlTlk0T3Ryckx0Z3pRakxMWnEtMHE2MUpQQ3pRIiwiYmFsYW5jZSI6MTE1MTMsImdvb2dsZV9pZCI6bnVsbCwicG9pbnRzIjowLCJmY21fdG9rZW4iOm51bGwsInN0b3JlX2lkIjoxMiwicm9sZV9pZCI6MywiY3JlYXRlZF9hdCI6IjIwMjQtMTAtMjBUMjM6NDA6MTUuMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDI0LTExLTA1VDA5OjExOjA0LjAwMFoiLCJkZWxldGVkX2F0IjpudWxsLCJwcm9maWxlIjp7ImlkIjozNCwiZnVsbG5hbWUiOiJBYmR1bCBGYWhtaSIsImJpcnRoT2ZEYXRlIjoiMjAwMS0wOC0wNlQxNzowMDowMC4wMDBaIiwibGlua19hdmF0YXIiOiJodHRwczovL21lZGlhLnJhaG1hZGZhbmkuY2xvdWQvVEVOVEFORyBWT1VDSEVSL1BST0ZJTEUvNjEyODg0LWxva2ktbm91dmVsbGUtc2VyaWUtbWFydmVsLXN1ci1kaXNuZXktZGV2b2lsZS1zYS1wcmVtaWVyZS1iYW5kZS1hbm5vbmNlXzAtMTcyOTQ5OTU1NDYwMS5qcGciLCJsaW5rX2Jhbm5lciI6Imh0dHA6Ly8xNTcuMjQ1LjE5My40OTozMDk5L1RFTlRBTkcgVk9VQ0hFUi9QUk9GSUxFL01hcnZlbF9Mb2dvXzAtMTcyOTQ5MzE4OTY4NC5wbmciLCJ1c2VySWQiOjQzLCJjcmVhdGVkX2F0IjoiMjAyNC0xMC0yMFQyMzo0MDoxNS4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMTAtMjFUMDE6MzI6MzcuMDAwWiJ9LCJhdXRob3JpemVkIjp0cnVlLCJpYXQiOjE3MzE2NTcwMzd9.Q7iWcT4kaV--1dMh4F3RDnZMG5yAz8NE_jMPFZWq20c'
  //     }
  //   });

  //   newSocket.on("connect", () => {
  //     console.log("Socket connected!");
  //     setIsConnected(true);
  //   });

  //   newSocket.on("disconnect", () => {
  //     console.log("Socket disconnected!");
  //     setIsConnected(false);
  //   });

  //   // const socket = socketIO.connect(
  //   //   "https://api-tentang-voucher.inovatiftujuh8.com/",
  //   //   {
  //   //     extraHeaders: {
  //   //       Authorization: `${user.token || user.tokenJwt}`,
  //   //     },
  //   //   }
  //   // );

  //   });

  //   return () => {};
  // }, [paymentDetail]);

  const startPing = () => {
    pingInterval.current = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "ping",
          })
        );
        console.log("Sent: ping");
      }
    }, 5000);
  };

  // Clear the ping timer
  const stopPing = () => {
    if (pingInterval.current) {
      clearInterval(pingInterval.current);
      pingInterval.current = null;
    }
  };

  React.useEffect(() => {
    const connectWs = () => {
      ws.current = new WebSocket("wss://websockets-rakhsa.inovatiftujuh8.com");

      ws.current.onopen = () => {
        console.log("Connected to WebSocket");
        // setSocket(ws);
        join();
        startPing();
      };

      ws.current.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        console.log(parsedData);

        if (
          parsedData.type === "sos" &&
          parsedData.platform_type === "amulet"
        ) {
          setFilterValue("recent");
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
              is_confirm: parsedData.is_confirm,
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
          // queryClient.fetchQuery(["message"], () =>
          //   getMessagesCallback(parsedData)
          // );
          router.push(
            `/list-reporting/chat?id=${parsedData.chat_id}&sos=${parsedData.sos_id}&sender=${parsedData.sender_id}`
          );
        }

        if (parsedData.type === "message") {
          messageMutation.mutate(parsedData);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
        stopPing();
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        // ws.current.close();
      };
    };

    connectWs();

    return () => {
      stopPing();
      ws.current?.close();
    };
  }, []);

  const getDetailReporting = async (sosId) => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/sos/${sosId}`
      );

      setDetailSOS(data.data);
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  const handleDialogTriggerClick = (event, sosId) => {
    getDetailReporting(sosId);
    // setIsDialogOpen(true);
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  return (
    <>
      {/* {confirmSOSData.is_confirm ? (
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
                    offerToEndChatSession={offerToEndChatSession}
                  />
                </CardHeader>
                {isOpenSearch && (
                  <SearchMessages
                    handleSetIsOpenSearch={handleSetIsOpenSearch}
                  />
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
                <CardFooter className="flex-none flex-col px-0 py-4 border-t border-border">
                  <MessageFooter
                    handleSendMessage={handleSendMessage}
                    replay={replay}
                    setReply={setReply}
                    replayData={replayData}
                  />
                </CardFooter>
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
      ) : (
        <> */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-2xl font-medium text-default-800 ">
          {filterValue === "recent"
            ? "Recently Reports"
            : filterValue === "on_process"
            ? "On Process Reports"
            : "History Reports"}
        </div>
        <div className="w-60">
          <Select onValueChange={handleFilterChange} value={filterValue}>
            <SelectTrigger>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Reports</SelectItem>
              <SelectItem value="on_process">On Process Reports</SelectItem>
              <SelectItem value="history">History Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        className={`grid ${
          filterValue === "recent" || filterValue === "on_process"
            ? "xl:grid-cols-3 md:grid-cols-2 grid-cols-1"
            : "xl:grid-cols-4 md:grid-cols-3 grid-cols-2"
        }  gap-3`}
      >
        {rows.length !== 0 ? (
          rows.map((row) => {
            return (
              <Dialog key={row.id}>
                <Card className="">
                  <CardContent className="p-0">
                    <div className="w-full h-[191px] bg-muted-foreground overflow-hidden rounded-t-md">
                      {row.type === "image" ? (
                        <Image
                          className="w-full h-full object-cover"
                          src={row.media}
                          alt="image"
                          width={500}
                          height={500}
                        />
                      ) : (
                        <Player src={row.media} style={{ height: "12rem" }} />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col gap-y-3">
                        <div className="flex flex-col gap-y-2">
                          <p className="text-muted-foreground text-sm">
                            Status
                          </p>
                          <Badge
                            color={
                              row.is_confirm && row.is_finish
                                ? "success"
                                : row.is_confirm && !row.is_finish
                                ? "info"
                                : "warning"
                            }
                            className="w-fit"
                          >
                            {row.is_confirm && row.is_finish
                              ? "Finished"
                              : row.is_confirm && !row.is_finish
                              ? "On Process"
                              : "Waiting Confirm"}
                          </Badge>
                        </div>
                        {(filterValue === "recent" ||
                          filterValue === "on_process") && (
                          <>
                            <div className="flex flex-col gap-y-2">
                              <p className="text-muted-foreground text-sm">
                                Name
                              </p>
                              <p className="text-sm">{row?.sender?.name}</p>
                            </div>
                            <div className="flex flex-col gap-y-2">
                              <p className="text-muted-foreground text-sm">
                                Location
                              </p>
                              <p className="text-sm">
                                {row.location
                                  ? row?.location?.length > 30
                                    ? `${row.location.substring(0, 30)}...`
                                    : row.location
                                  : "-"}
                              </p>
                            </div>
                            <div className="flex flex-col gap-y-2">
                              <p className="text-muted-foreground text-sm">
                                Time
                              </p>
                              <p className="text-sm">{`${row.time} WIB`}</p>
                            </div>
                          </>
                        )}
                        <div className="flex gap-x-3 mt-2">
                          <DialogTrigger
                            className="flex-1"
                            asChild
                            onClick={(event) =>
                              handleDialogTriggerClick(event, row.id)
                            }
                          >
                            <Button
                              className="basis-6/12 w-full exclude-element"
                              variant="outline"
                            >
                              Detail
                            </Button>
                          </DialogTrigger>

                          {row.is_confirm && row.is_finish ? (
                            <Link
                              className="basis-6/12 inline-block w-full"
                              href={{
                                pathname: "/list-reporting/chat",
                                query: {
                                  id: row.chat_id,
                                  sender: row.sender.id,
                                },
                              }}
                            >
                              <Button
                                type="button"
                                className="w-full exclude-element"
                                // onClick={() =>
                                //   router.push(
                                //     "/list-reporting/chat?name=Udin"
                                //   )
                                // }
                              >
                                {"Show Chat"}
                              </Button>
                            </Link>
                          ) : row.is_confirm && !row.is_finish ? (
                            <Link
                              className="basis-6/12 inline-block w-full"
                              href={`/list-reporting/chat?id=${row.chat_id}&sos=${row.id}&sender=${row.sender.id}`}
                            >
                              <Button
                                type="button"
                                className="w-full exclude-element"
                              >
                                {"Show Chat"}
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              className="basis-6/12 exclude-element"
                              onClick={(event) => confirmSOS(event, row.id)}
                            >
                              {"Confirm"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <DialogContent size="4xl">
                  <DialogHeader>
                    <DialogTitle className="text-base font-medium ">
                      Detail Report
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex justify-center gap-x-12 mt-2 text-sm text-default-500 space-y-4">
                    {detailSOS.type === "image" ? (
                      <Image
                        className="w-56 object-cover"
                        src={detailSOS.media}
                        alt="image"
                        width={500}
                        height={500}
                      />
                    ) : (
                      <Player
                        src={row.media}
                        style={{ width: "30rem", height: "20rem" }}
                      />
                    )}
                    <div className="flex flex-col gap-y-4">
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Name</p>
                        <p className="text-sm text-default-900">
                          {detailSOS.sender?.name}
                        </p>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">
                          Location
                        </p>
                        <Link
                          className="flex-1 block"
                          href={`https://www.google.com/maps/search/?api=1&query=${row.lat}%2C${row.lng}`}
                          target="_blank"
                        >
                          <p className="text-sm text-blue-700">
                            {detailSOS.location || "-"}
                          </p>
                        </Link>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Time</p>
                        <p className="text-sm text-default-900">{`${detailSOS.time} WIB`}</p>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Status</p>
                        <Badge
                          color={
                            row.is_confirm && row.is_finish
                              ? "success"
                              : row.is_confirm && !row.is_finish
                              ? "info"
                              : "warning"
                          }
                          className="w-fit"
                        >
                          {row.is_confirm && row.is_finish
                            ? "Finished"
                            : row.is_confirm && !row.is_finish
                            ? "On Process"
                            : "Waiting Confirm"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-8 gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" color="warning">
                        Close
                      </Button>
                    </DialogClose>

                    {detailSOS.is_confirm && detailSOS.is_finish ? (
                      <Link
                        className=""
                        href={{
                          pathname: "/list-reporting/chat",
                          query: {
                            id: row.chat_id,
                            sender: row.sender.id,
                          },
                        }}
                      >
                        <Button
                          className="exclude-element"
                          // onClick={(event) => confirmSOS(event, row.id)}
                          // disabled={row.is_confirm}
                        >
                          {"Show Chat"}
                        </Button>
                      </Link>
                    ) : detailSOS.is_confirm && !detailSOS.is_finish ? (
                      <Link
                        className=""
                        href={`/list-reporting/chat?id=${detailSOS.chat_id}&sos=${detailSOS.id}&sender=${detailSOS.sender.id}`}
                      >
                        <Button
                          className="exclude-element"
                          // onClick={(event) => confirmSOS(event, row.id)}
                          // disabled={row.is_confirm}
                        >
                          {"Show Chat"}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="exclude-element"
                        onClick={(event) => confirmSOS(event, detailSOS.id)}
                        // disabled={row.is_confirm}
                      >
                        {"Confirm"}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })
        ) : (
          <div className=" font-medium text-default-500">
            I'm Sorry, Reports Not Found
          </div>
        )}
      </div>
    </>
    //   )}
    // </>
  );
}

export default Reports;
