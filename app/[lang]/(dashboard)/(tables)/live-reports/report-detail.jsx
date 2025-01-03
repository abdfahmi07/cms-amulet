import { Badge } from "@/components/ui/badge";
import { api } from "@/config/axios.config";
import { getAddress } from "@/utils/maps";
import moment from "moment";
import Player from "next-video/player";
import Image from "next/image";
import { useEffect, useState } from "react";

const ReportDetail = ({ reportDetailData, refetchReports }) => {
  const {
    id: reportId,
    media,
    status,
    User,
    created_at,
    latitude,
    longitude,
    read_at: readAt,
  } = reportDetailData;
  const [formattedAddress, setFormattedAddress] = useState(null);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    const fetchFormattedAddress = async () => {
      const address = await getAddress({ lat: latitude, lng: longitude });

      setFormattedAddress(address);
    };

    fetchFormattedAddress();
    return () => {};
  }, []);

  const readTicket = async () => {
    try {
      await api.post(
        `/ticket/read/${reportId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      refetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!readAt) {
      readTicket();
    }
  }, []);

  return (
    <div className="flex gap-x-6 my-6">
      <div className="w-[30%]">
        {media?.type === "image" ? (
          <Image
            className="w-full object-cover"
            src={
              media?.link !== "http"
                ? media?.link
                : "https://media.rahmadfani.cloud/AMULET/AMULET-SOS/CAP8331634371716837295_0-1733475909741.jpg"
            }
            alt="image"
            width={100}
            height={100}
          />
        ) : (
          <Player
            src={
              media?.link !== "http"
                ? media?.link
                : "https://media.rahmadfani.cloud/AMULET/AMULET-SOS/REC1106426203504826497_0-1733475943711.temp"
            }
            style={{ width: "100%" }}
          />
        )}
      </div>
      <div className="w-[70%] flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <p className="text-muted-foreground text-sm">Name</p>
          <p className="text-sm capitalize">{User?.profile?.fullname}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-muted-foreground text-sm">Location</p>
          <p className="text-sm">{formattedAddress || "-"}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-muted-foreground text-sm">Time</p>
          <p className="text-sm">{`${moment(created_at).format(
            "DD/MM/YYYY HH:mm"
          )} WIB`}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
