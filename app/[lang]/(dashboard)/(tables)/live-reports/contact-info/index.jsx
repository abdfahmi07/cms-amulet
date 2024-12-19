"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import MuteNotification from "./mute-notification";
import EditNickname from "./edit-nickname";
import ChangeTheme from "./change-theme";
import BlockUser from "./block-user";
import MediaSheet from "./media-sheet";
import { AlertTriangle, FolderClosed, Image } from "lucide-react";
import { getAddress } from "@/utils/maps";

const ContactInfo = ({
  handleSetIsOpenSearch,
  handleShowInfo,
  detailReport,
}) => {
  const [formattedAddress, setFormattedAddress] = useState(null);
  const [showDrawer, setShowDrawer] = useState(null);
  const handleDrawer = (itemKey) => {
    setShowDrawer(itemKey);
  };

  useEffect(() => {
    const fetchFormattedAddress = async () => {
      const address = await getAddress({
        lat: detailReport?.latitude,
        lng: detailReport?.longitude,
      });

      setFormattedAddress(address);
    };

    fetchFormattedAddress();
    return () => {};
  }, []);

  return (
    <div className="flex-none w-[285px] absolute xl:relative right-0 h-full z-50 ">
      {showDrawer !== null && (
        <MediaSheet showDrawer={showDrawer} handleDrawer={handleDrawer} />
      )}

      <Card className="h-full overflow-hidden px-4 py-6">
        {/* <CardHeader> */}
        <div className="absolute xl:hidden">
          <Button
            size="icon"
            className="rounded-full bg-default-100 text-default-500 hover:bg-default-200"
            onClick={handleShowInfo}
          >
            <Icon icon="formkit:arrowright" className="text-sm" />
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <Avatar className="w-16 h-16 lg:h-24 lg:w-24">
            <AvatarImage
              src={detailReport?.User?.profile?.photo_url}
              alt={detailReport?.User?.profile?.fullname}
            />
            <AvatarFallback className="uppercase text-2xl">
              {detailReport?.User?.profile?.fullname?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="mt-3 text-lg lg:text-xl font-semibold text-default-900">
            {detailReport?.User?.profile?.fullname}
          </div>
          <span className="text-sm text-default-600 capitalize text-center line-clamp-2 mt-2 ">
            {formattedAddress}
          </span>
          <Link
            className="block"
            href={`https://www.google.com/maps/search/?api=1&query=${detailReport?.latitude}%2C${detailReport?.longitude}`}
            target="_blank"
          >
            <span className="text-sm text-primary capitalize text-center line-clamp-2 mt-2">
              Lihat Lokasi
            </span>
          </Link>
        </div>
        {/* <div className="flex justify-center gap-6  pt-3">
            <div className="flex flex-col items-center gap-1">
              <Link
                href="/chat"
                className="h-10 w-10 rounded-full bg-secondary dark:bg-default-500/50 flex justify-center items-center"
              >
                <Icon
                  icon="fa-regular:user"
                  className="text-lg text-default-900"
                />
              </Link>
              <span className="text-xs text-default-900">Profile</span>
            </div>
            <MuteNotification />
            <div
              className="flex flex-col items-center gap-1"
              onClick={handleSetIsOpenSearch}
            >
              <Button
                type="button"
                color="secondary"
                size="icon"
                className="rounded-full"
              >
                <Icon icon="zondicons:search" />
              </Button>
              <span className="text-xs text-default-900">Search</span>
            </div>
          </div> */}
        {/* </CardHeader> */}
      </Card>
    </div>
  );
};

export default ContactInfo;
