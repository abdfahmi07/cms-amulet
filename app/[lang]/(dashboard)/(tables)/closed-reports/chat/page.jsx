"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Blank from "./blank";
import MessageHeader from "./message-header";
import Messages from "./messages";
import { getReportDetail } from "./chat-config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EmptyMessage from "./empty-message";
import Loader from "./loader";
import PinnedMessages from "./pin-messages";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

const ClosedReportChat = () => {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const getReportDetailCallback = useCallback(
    (reportDetailId) => getReportDetail(reportDetailId),
    []
  );
  const isLg = useMediaQuery("(max-width: 1024px)");
  const chatHeightRef = useRef(null);

  const {
    isLoading: reportDetailLoading,
    isError: reportDetailIsError,
    data: reportDetailData,
    error: reportDetailError,
    refetch: refetchReportDetail,
  } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportDetailCallback(reportId),
  });

  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex gap-5 app-height relative rtl:space-x-reverse">
        {reportId ? (
          <div className="flex-1 ">
            <div className=" flex space-x-5 h-full rtl:space-x-reverse">
              <div className="flex-1">
                <Card className="h-full flex flex-col ">
                  <CardHeader className="flex-none mb-0">
                    <MessageHeader
                      mblChatHandler={() =>
                        setShowContactSidebar(!showContactSidebar)
                      }
                      reportDetailData={reportDetailData ?? {}}
                    />
                  </CardHeader>

                  <CardContent className="!p-0 relative flex-1 overflow-y-auto">
                    <div
                      className="h-full py-4 overflow-y-auto no-scrollbar"
                      ref={chatHeightRef}
                    >
                      {reportDetailLoading ? (
                        <Loader />
                      ) : (
                        <>
                          {reportDetailIsError ||
                          reportDetailData?.messages?.length === 0 ? (
                            <EmptyMessage />
                          ) : (
                            <div className="">
                              {reportDetailData?.note && (
                                <Alert variant="soft" className="mb-6">
                                  <AlertDescription>
                                    Telah Ditangani Oleh :{" "}
                                    <span className="font-medium">
                                      {reportDetailData?.note}
                                    </span>
                                  </AlertDescription>
                                </Alert>
                              )}
                              {reportDetailData?.messages?.map((message, i) => (
                                <Messages
                                  key={`message-list-${i}`}
                                  message={message}
                                  contact={reportDetailData?.User?.profile}
                                  index={i}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <Blank mblChatHandler={() => setShowContactSidebar(true)} />
        )}
      </div>
    </div>
  );
};

export default ClosedReportChat;
