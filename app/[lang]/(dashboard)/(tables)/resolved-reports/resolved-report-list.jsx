"use client";
import * as React from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
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
import Player from "next-video/player";
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
import { api } from "@/config/axios.config";
import { Star, StarIcon } from "lucide-react";

export function ResolvedReportList() {
  const [resolvedReportList, setResolvedReportList] = React.useState([]);
  const [resolvedReportDetail, setResolvedReportDetail] = React.useState({});
  const [filterValue, setFilterValue] = React.useState("live");
  const [pinnedMessages, setPinnedMessages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPage, setTotalPage] = React.useState(0);

  const router = useRouter();
  const socket = getSocket();
  const queryClient = useQueryClient();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const chatHeightRef = React.useRef(null);

  React.useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const getListReporting = async () => {
    try {
      const { data } = await api.get(`/ticket`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          status: "Resolved",
          page: currentPage,
        },
      });

      setCurrentPage(currentPage);
      setTotalPage(data.data.pagination.pages);

      if (currentPage !== 0) {
        setResolvedReportList((prevState) => [...prevState, ...data.data.data]);
      } else {
        setResolvedReportList(data.data.data);
      }
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  React.useEffect(() => {
    getListReporting();
  }, [currentPage]);

  const getDetailReporting = async (reportId) => {
    try {
      const { data } = await api.get(`/ticket/messages/${reportId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const formattedAddress = await getAddress({
        lat: data?.data?.latitude,
        lng: data?.data?.longitude,
      });

      setResolvedReportDetail({ ...data.data, address: formattedAddress });
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  const handleDialogTriggerClick = (event, reportId) => {
    getDetailReporting(reportId);
    // setIsDialogOpen(true);
  };

  const handleLoadMoreProducts = () => {
    setCurrentPage((prevState) => prevState + 1);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-2xl font-medium text-default-800 ">
          Resolved Reports
        </div>
      </div>
      <div
        className={`grid 
            xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3`}
      >
        {resolvedReportList?.length !== 0 ? (
          resolvedReportList?.map((resolvedReport) => {
            return (
              <Dialog key={resolvedReport?.id}>
                <Card className="">
                  <CardContent className="p-0">
                    <div className="w-full h-[191px] bg-muted-foreground overflow-hidden rounded-t-md">
                      {resolvedReport?.media?.type === "image" ? (
                        <Image
                          className="w-full h-full object-cover"
                          src={
                            resolvedReport?.media?.link !== "http"
                              ? resolvedReport?.media?.link
                              : "https://media.rahmadfani.cloud/AMULET/AMULET-SOS/CAP8331634371716837295_0-1733475909741.jpg"
                          }
                          alt="image"
                          width={500}
                          height={500}
                        />
                      ) : (
                        <Player
                          src={
                            resolvedReport?.media?.link !== "http"
                              ? resolvedReport?.media?.link
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
                          <Badge color="success" className="w-fit">
                            {resolvedReport?.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-y-2">
                          <p className="text-muted-foreground text-sm">
                            Rating
                          </p>
                          <div className="flex gap-x-1">
                            {resolvedReport.rating ? (
                              [...Array(resolvedReport.rating).keys()].map(
                                (i) => (
                                  <StarIcon class="h-5 w-5" color="orange" />
                                )
                              )
                            ) : (
                              <span>'-'</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-x-3 mt-2">
                          <DialogTrigger
                            className="flex-1"
                            asChild
                            onClick={(event) =>
                              handleDialogTriggerClick(
                                event,
                                resolvedReport?.id
                              )
                            }
                          >
                            <Button
                              className="basis-6/12 w-full exclude-element"
                              variant="outline"
                            >
                              Detail
                            </Button>
                          </DialogTrigger>
                          <Link
                            className="basis-6/12 inline-block w-full"
                            href={{
                              pathname: "/resolved-reports/chat",
                              query: {
                                id: resolvedReport?.id,
                              },
                            }}
                          >
                            <Button
                              type="button"
                              className="w-full exclude-element"
                            >
                              {"Show Chat"}
                            </Button>
                          </Link>
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

                  <div className="flex gap-x-8 mt-2 text-sm text-default-500 space-y-4">
                    {resolvedReportDetail?.media?.type === "image" ? (
                      <Image
                        className="w-56 object-cover"
                        src={resolvedReportDetail?.media?.link}
                        alt="image"
                        width={500}
                        height={500}
                      />
                    ) : (
                      <Player
                        src={resolvedReportDetail?.media?.link}
                        style={{ width: "30rem", height: "20rem" }}
                      />
                    )}
                    <div className="flex flex-col gap-y-4">
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Name</p>
                        <p className="text-sm text-default-900">
                          {resolvedReportDetail?.User?.profile?.fullname}
                        </p>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">
                          Location
                        </p>
                        <Link
                          className="flex-1 block"
                          href={`https://www.google.com/maps/search/?api=1&query=${resolvedReportDetail.latitude}%2C${resolvedReportDetail.longitude}`}
                          target="_blank"
                        >
                          <p className="text-sm text-blue-700">
                            {resolvedReportDetail.address || "-"}
                          </p>
                        </Link>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Time</p>
                        <p className="text-sm text-default-900">{` ${moment(
                          resolvedReportDetail.created_at
                        ).format("DD/MM/YYYY H:mm")} WIB`}</p>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Status</p>
                        <Badge color="success" className="w-fit">
                          {resolvedReportDetail.status}
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
                    <Link
                      className=""
                      href={{
                        pathname: "/resolved-reports/chat",
                        query: {
                          id: resolvedReport?.id,
                        },
                      }}
                    >
                      <Button type="button" className="exclude-element">
                        {"Show Chat"}
                      </Button>
                    </Link>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })
        ) : (
          <div className=" font-medium text-default-500">
            Maaf, untuk saat ini belum ada kasus yang sudah ditutup
          </div>
        )}
      </div>
      {totalPage > currentPage && (
        <div className="flex justify-center">
          <Button size="lg" onClick={handleLoadMoreProducts}>
            Lihat Lainnya
          </Button>
        </div>
      )}
    </>
  );
}

export default ResolvedReportList;
