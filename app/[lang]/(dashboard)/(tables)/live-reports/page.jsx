"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

import ContactList from "./report-list";
import { useState } from "react";
import Blank from "./blank";
import MessageHeader from "./message-header";
import MessageFooter from "./message-footer";

import Messages from "./messages";
import {
  getMessages,
  sendMessage,
  deleteMessage,
  getReports,
  getReportDetail,
} from "./chat-config";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyProfileHeader from "./my-profile-header";
import EmptyMessage from "./empty-message";
import Loader from "./loader";
import { isObjectNotEmpty } from "@/lib/utils";
import SearchMessages from "./contact-info/search-messages";
import PinnedMessages from "./pin-messages";
import ForwardMessage from "./forward-message";
import ContactInfo from "./contact-info";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import ReportList from "./report-list";
import ReportDetail from "./report-detail";
import ReportDetailFooter from "./report-detail-footer";
import { useReports } from "@/store";
import { getSocket } from "@/config/socket-io";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/config/axios.config";
import { Button } from "@/components/ui/button";

const LiveReportsPage = () => {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReportStatus, setSelectedReportStatus] = useState(null);
  const [showContactSidebar, setShowContactSidebar] = useState(false);

  const [showInfo, setShowInfo] = useState(false);
  const queryClient = useQueryClient();
  // Memoize getMessages using useCallback
  const getMessagesCallback = useCallback(
    (reportId) => getMessages(reportId),
    []
  );
  const getReportDetailCallback = useCallback(
    (reportId) => getReportDetail(reportId),
    []
  );
  // reply state
  const [replay, setReply] = useState(false);
  const [replayData, setReplyData] = useState({});

  // search state
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [pinnedMessages, setPinnedMessages] = useState([]);
  // Forward State
  const [isForward, setIsForward] = useState(false);
  const { reports: listReport, setReports: setListReport } = useReports();
  const socket = getSocket();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const {
    isLoading,
    isError,
    data: reports,
    error,
    refetch: refetchReports,
    isFetched: reportsIsFetched,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getReports(),
  });

  useEffect(() => {
    if (reports && reportsIsFetched) {
      setListReport(reports);
    }
  }, [reports, setListReport]);

  const {
    isLoading: reportDetailLoading,
    isError: reportDetailIsError,
    data: reportDetailData,
    error: reportDetailError,
    refetch: refetchReportDetail,
  } = useQuery({
    queryKey: ["reportDetail", selectedReportId, listReport],
    queryFn: () => getReportDetailCallback(selectedReportId),
    enabled: !!selectedReportId,
  });

  const {
    isLoading: messageLoading,
    isError: messageIsError,
    data: chats,
    error: messageError,
    refetch: refetchMessage,
  } = useQuery({
    queryKey: ["message", selectedReportId, selectedReportStatus],
    queryFn: () => getMessagesCallback(selectedReportId),
    enabled: !!selectedReportId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
    },
  });

  const onDelete = (selectedReportId, index) => {
    const obj = { selectedReportId, index };
    deleteMutation.mutate(obj);

    // Remove the deleted message from pinnedMessages if it exists
    const updatedPinnedMessages = pinnedMessages.filter(
      (msg) => msg.selectedReportId !== selectedReportId && msg.index !== index
    );

    setPinnedMessages(updatedPinnedMessages);
  };

  const openChat = async (reportId, status) => {
    setSelectedReportStatus(status);
    setSelectedReportId(reportId);
    setReply(false);

    socket.emit("join:ticketRoom", reportId);
    // await refetchReportDetail({
    //   queryFn: () => getReportDetail(reportId),
    // });
    if (showContactSidebar) {
      setShowContactSidebar(false);
    }
  };

  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const sendMessageWS = (message) => {
    try {
      socket.emit("send:ticketMessage", {
        ticket_id: selectedReportId,
        message: message,
        sender: chats.Staff,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const messageMutation = useMutation({
    mutationFn: refetchMessage,
    onSuccess: () => {},
  });

  const handleSendMessage = (message) => {
    if (!selectedReportId || !message || selectedReportStatus !== "In Progress")
      return;

    sendMessageWS(message);
  };

  const chatHeightRef = useRef(null);

  // replay message
  const handleReply = (data, contact) => {
    const newObj = {
      message: data,
      contact,
    };
    setReply(true);
    setReplyData(newObj);
  };

  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [handleSendMessage, reports]);

  useEffect(() => {
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

  const handleAddAuthority = async (authority) => {
    try {
      const { data } = await api.post(
        `/ticket/add/note/${selectedReportId}`,
        {
          note: authority,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      refetchReportDetail();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmReport = async () => {
    try {
      const { data } = await api.post(
        `/ticket/confirm/${selectedReportId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      refetchReports();
      setSelectedReportStatus("In Progress");
      socket.emit("join:ticketRoom", selectedReportId);
      socket.on("listen:ticketMessage", (data) => {
        messageMutation.mutate(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.on("listen:ticketMessage", (data) => {
      console.log(data);
      messageMutation.mutate(data);
    });
  }, []);

  useEffect(() => {
    socket.on("listen:ticketClosed", (data) => {
      setSelectedReportId(null);
      refetchReports();
    });
  }, []);

  return (
    <div className="flex flex-col gap-y-3">
      {/* <div className="flex gap-x-2">
        <Button type="button">Closed Case</Button>
        <Button type="button">Resolved Case</Button>
      </div> */}
      <div className="flex gap-5 app-height  relative rtl:space-x-reverse">
        {isLg && showContactSidebar && (
          <div
            className=" bg-background/60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md"
            onClick={() => setShowContactSidebar(false)}
          ></div>
        )}
        {isLg && showInfo && (
          <div
            className=" bg-background/60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-40 rounded-md"
            onClick={() => setShowInfo(false)}
          ></div>
        )}
        <div
          className={cn("transition-all duration-150 flex-none  ", {
            "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]": isLg,
            "flex-none min-w-[260px]": !isLg,
            "left-0": isLg && showContactSidebar,
            "-left-full": isLg && !showContactSidebar,
          })}
        >
          <Card className="h-full pb-0">
            <CardHeader className="border-none pb-0 mb-0">
              <MyProfileHeader />
            </CardHeader>
            <CardContent className="pt-1 px-0 lg:h-[calc(100%-55px)] h-[calc(100%-70px)]">
              <ScrollArea className="h-full">
                {isLoading ? (
                  <Loader />
                ) : listReport.length !== 0 ? (
                  listReport?.map((report) => (
                    <ReportList
                      key={report.id}
                      report={report}
                      selectedReportId={selectedReportId}
                      openChat={openChat}
                    />
                  ))
                ) : (
                  <div className="h-full flex flex-col justify-center items-center">
                    <p className="w-48 text-center text-default-500">
                      Untuk saat ini masih belum ada accident terbaru
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {selectedReportId ? (
          <div className="flex-1 ">
            <div className=" flex space-x-5 h-full rtl:space-x-reverse">
              <div className="flex-1">
                <Card className="h-full flex flex-col ">
                  <CardHeader className="flex-none mb-0">
                    <MessageHeader
                      showInfo={showInfo}
                      handleShowInfo={handleShowInfo}
                      mblChatHandler={() =>
                        setShowContactSidebar(!showContactSidebar)
                      }
                      reportDetailData={reportDetailData ?? {}}
                      setSelectedReportId={setSelectedReportId}
                      refetchReports={refetchReports}
                    />
                  </CardHeader>
                  {isOpenSearch && (
                    <SearchMessages
                      handleSetIsOpenSearch={handleSetIsOpenSearch}
                    />
                  )}

                  <CardContent className="!p-0 relative flex-1 overflow-y-auto">
                    {selectedReportStatus === "In Progress" ? (
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
                              <div className="">
                                {reportDetailData?.note && (
                                  <Alert
                                    variant="soft"
                                    className="mb-6 sticky z-50 top-0"
                                  >
                                    <AlertDescription>
                                      Telah Ditangani Oleh :{" "}
                                      <span className="font-medium">
                                        {reportDetailData?.note}
                                      </span>
                                    </AlertDescription>
                                  </Alert>
                                )}
                                {chats?.messages?.map((message, i) => (
                                  <Messages
                                    key={`message-list-${i}`}
                                    message={message}
                                    contact={chats?.User?.profile}
                                    onDelete={onDelete}
                                    index={i}
                                    selectedReportId={selectedReportId}
                                    handleReply={handleReply}
                                    replayData={replayData}
                                    handleForward={handleForward}
                                    handlePinMessage={handlePinMessage}
                                    pinnedMessages={pinnedMessages}
                                    messageMutation={messageMutation}
                                    selectedReportStatus={selectedReportStatus}
                                    refetchReports={refetchReports}
                                    setSelectedReportId={setSelectedReportId}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        <PinnedMessages
                          pinnedMessages={pinnedMessages}
                          handleUnpinMessage={handleUnpinMessage}
                        />
                      </div>
                    ) : reportDetailData && !reportDetailLoading ? (
                      <ReportDetail
                        reportDetailData={reportDetailData}
                        refetchReports={refetchReports}
                      />
                    ) : (
                      <Loader />
                    )}
                  </CardContent>
                  <CardFooter className="flex-none flex-col px-0 py-4 border-t border-border">
                    {selectedReportStatus === "In Progress" ? (
                      reportDetailData ? (
                        <MessageFooter
                          handleSendMessage={handleSendMessage}
                          replay={replay}
                          setReply={setReply}
                          replayData={replayData}
                          reportDetailData={reportDetailData}
                          handleAddAuthority={handleAddAuthority}
                        />
                      ) : null
                    ) : reportDetailData ? (
                      <ReportDetailFooter
                        selectedReportId={selectedReportId}
                        setSelectedReportStatus={setSelectedReportStatus}
                        refetchReports={refetchReports}
                        reportDetailData={reportDetailData}
                        refetchMessage={refetchMessage}
                        confirmReport={confirmReport}
                      />
                    ) : null}
                  </CardFooter>
                </Card>
              </div>

              {showInfo && (
                <ContactInfo
                  handleSetIsOpenSearch={handleSetIsOpenSearch}
                  handleShowInfo={handleShowInfo}
                  contact={contacts?.contacts?.find(
                    (contact) => contact.id === selectedReportId
                  )}
                />
              )}
            </div>
          </div>
        ) : (
          <Blank mblChatHandler={() => setShowContactSidebar(true)} />
        )}
        {/* <ForwardMessage
        open={isForward}
        contact={"s"}
        setIsOpen={setIsForward}
        contacts={contacts}
      /> */}
      </div>
    </div>
  );
};

export default LiveReportsPage;
