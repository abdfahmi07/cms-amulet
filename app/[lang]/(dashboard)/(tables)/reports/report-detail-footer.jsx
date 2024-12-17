import { Button } from "@/components/ui/button";
import { getSocket } from "@/config/socket-io";
import { API_BASE_URL } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";

const ReportDetailFooter = ({
  selectedReportId,
  setSelectedReportStatus,
  refetchReports,
  reportDetailData,
}) => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const { latitude, longitude } = reportDetailData;
  const socket = getSocket();
  console.log(setSelectedReportStatus);

  const confirmReport = async (event) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/ticket/confirm/${selectedReportId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      refetchReports();
      setSelectedReportStatus("In Progress");
      socket.emit("join:ticketRoom", selectedReportId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-end gap-x-2 w-full pr-4">
      <Link
        className="block"
        href={`https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}`}
        target="_blank"
      >
        <Button variant="outline" type="button">
          Lihat Lokasi
        </Button>
      </Link>
      <Button type="button" onClick={confirmReport}>
        Konfirmasi
      </Button>
    </div>
  );
};

export default ReportDetailFooter;
