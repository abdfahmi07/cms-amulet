import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultUser from "@/public/images/avatar/default-user.png";
import logoBrand from "@/public/images/logo/logo-short.png";
import Image from "next/image";

const MyProfileHeader = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <>
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={logoBrand} alt={user?.profile?.fullname} />
            <AvatarFallback className="uppercase">
              <Image src={logoBrand} />
              {/* {user?.profile?.fullname.slice(0, 2)} */}
            </AvatarFallback>
          </Avatar>
          <div className="block">
            <div className="text-sm font-medium text-default-900 ">
              <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-success before:absolute before:top-1.5 before:-right-3 ">
                {user?.profile?.fullname}
              </span>
            </div>
            <span className="text-xs text-default-600">{user?.email}</span>
          </div>
        </div>
      </div>
      {/* <InputGroup merged className="hidden lg:flex">
        <InputGroupText>
          <Icon icon="heroicons:magnifying-glass" />
        </InputGroupText>
        <Input type="text" placeholder="Search by name" />
      </InputGroup> */}
      {/* actions */}
      <div className="hidden lg:flex flex-wrap justify-between border-b-4 border-default-200">
        {/* <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="gala:chat" />
          </span>
          <span className="text-xs">Chats</span>
        </Button>
        <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="material-symbols:group" />
          </span>
          <span className="text-xs">Groups</span>
        </Button>
        <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="ci:bell-ring" />
          </span>
          <span className="text-xs">Notification</span>
        </Button> */}
      </div>
    </>
  );
};

export default MyProfileHeader;
