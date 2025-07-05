import StatCard from "@/components/common/StatCard";
import axios from "axios";
import { AlertTriangle, BookOpenCheck, Library, Repeat } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const OverviewStats = () => {
  const [bookStats, setBookStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/book/overviewStats`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          setBookStats(response.data.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3">
      <StatCard
        icon={Library}
        title="Total Books"
        value={loading ? null : bookStats?.totalBooks}
        color="blue"
      />
      <StatCard
        icon={BookOpenCheck}
        title="Available Books"
        value={loading ? null : bookStats?.availableBooks}
        color="green"
      />
      <StatCard
        icon={Repeat}
        title="Total Borrowings"
        value={loading ? null : bookStats?.issuedBooks}
        color="cyan"
      />
      <StatCard
        icon={AlertTriangle}
        title="Overdue Books"
        value={loading ? null : bookStats?.overdueBooks}
        color="red"
      />
    </div>
  );
};

export default OverviewStats;
