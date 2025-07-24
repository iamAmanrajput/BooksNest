import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import axios from "axios";
import { toast } from "sonner";
import { BookOpen, NotebookPen, Users } from "lucide-react";

const AnalyticsStats = () => {
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/analytics/summary`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          setAnalyticsStats(response.data.data);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      <AnalyticsCard
        icon={BookOpen}
        title="Total Books"
        value={loading ? null : analyticsStats?.totalBooks}
        color="blue"
        percentageChange={analyticsStats?.booksPercentIncrease.toFixed(1)}
        showTrend={true}
      />
      <AnalyticsCard
        icon={Users}
        title="Total Users"
        value={loading ? null : analyticsStats?.totalUsers}
        color="cyan"
        percentageChange={analyticsStats?.usersPercentIncrease.toFixed(1)}
        showTrend={true}
      />
      <AnalyticsCard
        icon={NotebookPen}
        title="Active Borrowings"
        value={loading ? null : analyticsStats?.currentlyIssuedBooks}
        color="green"
        showTrend={false}
      />
    </div>
  );
};

export default AnalyticsStats;
