"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ItinerariesTable from "./itineraries-table";

const ItinerariesPage = () => {
  return (
    <div className="space-y-5">
      <div className="text-2xl font-medium text-default-800">Itineraries</div>
      <Card>
        {/* <CardHeader>
          <CardTitle>Itineraries</CardTitle>
        </CardHeader> */}
        <CardContent className="p-0">
          <ItinerariesTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItinerariesPage;
