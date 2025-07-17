import React, { useEffect, useState } from "react";
import StatCard from "@/components/common/StatCard";
import { Hourglass, Undo2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const RequestStats = () => {
  const [requestStats, setRequestStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/borrow/requestStats`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          setRequestStats(response.data.data);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestStats();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      <StatCard
        icon={Hourglass}
        title="Pending Requests"
        value={loading ? null : requestStats?.pendingRequests}
        color="yellow"
      />
      <StatCard
        icon={Undo2}
        title="Return Requests"
        value={loading ? null : requestStats?.returnRequests}
        color="green"
      />
    </div>
  );
};

export default RequestStats;
