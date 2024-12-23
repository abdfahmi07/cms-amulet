"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import UsersTable from "./users-table";

const UsersPage = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div className="text-2xl font-medium text-default-800">Users</div>
      </div>
      <Card>
        <CardContent className="p-0">
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
