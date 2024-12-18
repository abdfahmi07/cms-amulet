"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClosedReports from "./closed-report-list";

const ClosedReportsPage = () => {
  return (
    <div className="space-y-5">
      <Card>
        {/* <CardHeader>
          <CardTitle>Closed Reports</CardTitle>
        </CardHeader> */}
        <CardContent className="flex flex-col gap-y-5 p-6">
          <ClosedReports />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClosedReportsPage;
