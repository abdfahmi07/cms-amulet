"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResolvedReports from "./resolved-report-list";

const ResolvedReportsPage = () => {
  return (
    <div className="space-y-5">
      <Card>
        {/* <CardHeader>
          <CardTitle>Closed Reports</CardTitle>
        </CardHeader> */}
        <CardContent className="flex flex-col gap-y-5 p-6">
          <ResolvedReports />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResolvedReportsPage;
