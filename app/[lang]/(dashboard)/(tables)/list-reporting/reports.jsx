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
import { getSocket } from "@/config/socket-io";
import { getAddress } from "@/utils/maps";
import moment from "moment";

export function Reports() {
  const [sorting, setSorting] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [confirmSOSData, setConfirmSOSData] = React.useState({});
  const [detailSOS, setDetailSOS] = React.useState({});
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [selectedChatId, setSelectedChatId] = React.useState(null);
  const [showContactSidebar, setShowContactSidebar] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("live");

  const [showInfo, setShowInfo] = React.useState(false);
  const queryClient = useQueryClient();

  const [replay, setReply] = React.useState(false);
  const [replayData, setReplyData] = React.useState({});

  const [isOpenSearch, setIsOpenSearch] = React.useState(false);

  const [pinnedMessages, setPinnedMessages] = React.useState([]);
  const [isForward, setIsForward] = React.useState(false);
  const router = useRouter();
  const socket = getSocket();

  const ws = React.useRef(null);
  const chatHeightRef = React.useRef(null);
  const pingInterval = React.useRef(null);

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

  const handleSendMessage = (message) => {
    if (!message) return;

    sendMessageWS(message);
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

  const getListReporting = async () => {
    if (filterValue !== "live") {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL_STAGING}/api/v1/ticket`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: {
              status:
                filterValue === "recent"
                  ? "Open"
                  : filterValue === "on_process"
                  ? "In Progress"
                  : filterValue === "closed"
                  ? "Closed"
                  : "Resolved",
            },
          }
        );

        setRows(data.data);
        // setRows(data.data.slice().reverse());
      } catch (err) {
        console.log(err);
        toast.error(err.response.message || "Something Went Wrong");
      }
    }
  };

  React.useEffect(() => {
    getListReporting();
  }, [filterValue]);

  const confirmSOS = async (event, sosId) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_STAGING}/api/v1/ticket/confirm/${sosId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(data);
      router.push(`/list-reporting/chat?id=${data.data.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    socket.on("listen:openCase", async (data) => {
      console.log(data, "data");
      const formattedAddress = await getAddress({
        lat: data.latitude,
        lng: data.longitude,
      });
      const formattedData = { ...data, address: formattedAddress };

      setRows((prevRows) => [formattedData, ...prevRows]);
    });
  }, []);

  React.useEffect(() => {
    socket.on("listen:removeOpenCase", (data) => {
      const filteredData = rows.filter((row) => row.id !== data.id);
      setRows(filteredData);
    });
  }, [rows]);

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
      <div className="flex items-center justify-between">
        <div className="flex-1 text-2xl font-medium text-default-800 ">
          {filterValue === "live"
            ? "Live Reports"
            : filterValue === "recent"
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
              <SelectItem value="live">Live Reports</SelectItem>
              <SelectItem value="recent">Recently Reports</SelectItem>
              <SelectItem value="on_process">On Process Reports</SelectItem>
              <SelectItem value="closed">Closed Reports</SelectItem>
              <SelectItem value="resolved">Resolved Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        className={`grid ${
          filterValue === "live" ||
          filterValue === "recent" ||
          filterValue === "on_process"
            ? "xl:grid-cols-3 md:grid-cols-2 grid-cols-1"
            : "xl:grid-cols-4 md:grid-cols-3 grid-cols-2"
        }  gap-3`}
      >
        {rows.length !== 0 ? (
          rows.map((row) => {
            return (
              <Dialog key={row?.id}>
                <Card className="">
                  <CardContent className="p-0">
                    <div className="w-full h-[191px] bg-muted-foreground overflow-hidden rounded-t-md">
                      {row?.media?.type === "image" ? (
                        <Image
                          className="w-full h-full object-cover"
                          src={
                            row?.media?.link !== "http"
                              ? row?.media?.link
                              : "https://media.rahmadfani.cloud/AMULET/AMULET-SOS/CAP8331634371716837295_0-1733475909741.jpg"
                          }
                          alt="image"
                          width={500}
                          height={500}
                        />
                      ) : (
                        <Player
                          src={
                            row?.media?.link !== "http"
                              ? row?.media?.link
                              : "https://media.rahmadfani.cloud/AMULET/AMULET-SOS/REC1106426203504826497_0-1733475943711.temp"
                          }
                          style={{ height: "12rem" }}
                        />
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
                              row?.status === "Open"
                                ? "warning"
                                : row?.status === "Resolved"
                                ? "success"
                                : "info"
                            }
                            className="w-fit"
                          >
                            {row?.status}
                          </Badge>
                        </div>
                        {/* {(filterValue === "live" ||
                          filterValue === "recent" ||
                          filterValue === "on_process" ) && ( */}
                        <>
                          <div className="flex flex-col gap-y-2">
                            <p className="text-muted-foreground text-sm">
                              Name
                            </p>
                            <p className="text-sm">
                              {row?.User?.profile?.fullname}
                            </p>
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <p className="text-muted-foreground text-sm">
                              Location
                            </p>
                            <p className="text-sm">{row?.address}</p>
                            {/* <p className="text-sm">{row?.id}</p> */}
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <p className="text-muted-foreground text-sm">
                              Time
                            </p>
                            <p className="text-sm">{`${moment(
                              row?.created_at
                            ).format("DD/MM/YYYY HH:mm")} WIB`}</p>
                          </div>
                        </>
                        {/* )} */}
                        <div className="flex gap-x-3 mt-2">
                          <DialogTrigger
                            className="flex-1"
                            asChild
                            onClick={(event) =>
                              handleDialogTriggerClick(event, row?.id)
                            }
                          >
                            <Button
                              className="basis-6/12 w-full exclude-element"
                              variant="outline"
                            >
                              Detail
                            </Button>
                          </DialogTrigger>

                          {row?.status === "Resolved" &&
                          row?.status === "Closed" ? (
                            <Link
                              className="basis-6/12 inline-block w-full"
                              href={{
                                pathname: "/list-reporting/chat",
                                // query: {
                                //   id: row.chat_id,
                                //   sender: row.sender.id,
                                // },
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
                          ) : row?.status === "In Progress" ? (
                            <Link
                              className="basis-6/12 inline-block w-full"
                              // href={`/list-reporting/chat?id=${row.chat_id}&sos=${row.id}&sender=${row.sender.id}`}
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
                              type="button"
                              className="basis-6/12 exclude-element"
                              onClick={(event) => confirmSOS(event, row?.id)}
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

                  {/* <div className="flex justify-center gap-x-12 mt-2 text-sm text-default-500 space-y-4">
                    {detailSOS?.media?.type === "image" ? (
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
                  </div> */}
                  <DialogFooter className="mt-8 gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" color="warning">
                        Close
                      </Button>
                    </DialogClose>

                    {/* {detailSOS.is_confirm && detailSOS.is_finish ? (
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
                          type="button"
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
                          type="button"
                          className="exclude-element"
                          // onClick={(event) => confirmSOS(event, row.id)}
                          // disabled={row.is_confirm}
                        >
                          {"Show Chat"}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        className="exclude-element"
                        onClick={(event) => confirmSOS(event, detailSOS.id)}
                        // disabled={row.is_confirm}
                      >
                        {"Confirm"}
                      </Button>
                    )} */}
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
  );
}

export default Reports;
