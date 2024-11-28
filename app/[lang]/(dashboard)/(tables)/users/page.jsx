"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./users-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const UsersPage = () => {
  const [isOpenSheet, setIsOpenSheet] = React.useState(false);
  const [detailUser, setDetailUser] = React.useState({});

  const addUserModal = () => {
    // setSelectedProject(null);
    // setSelectedProjectId(null);
    setDetailUser({});
    setIsOpenSheet(true);
    // wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div className="text-2xl font-medium text-default-800">Users</div>
        <Button onClick={addUserModal} className="whitespace-nowrap">
          <Plus className="w-4 h-4  ltr:mr-2 rtl:ml-2 " />
          Add User
        </Button>
      </div>
      <Card>
        {/* <CardHeader>
          <CardTitle>Itineraries</CardTitle>
        </CardHeader> */}
        <CardContent className="p-0">
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
