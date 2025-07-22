import StatCard from "@/components/common/StatCard";
import axios from "axios";
import { UserCheck, Users, UserX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const UserStats = () => {
  const [loading, setLoading] = useState(false);
  const [usersStats, setUsersStats] = useState(null);

  useEffect(() => {
    const fetchUsersStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/users/stats`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response?.data?.success) {
          setUsersStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching profile stats:", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersStats();
  }, []);
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      <StatCard
        icon={Users}
        title="Total Users"
        value={loading ? null : usersStats?.totalUsers}
        color="blue"
      />
      <StatCard
        icon={UserCheck}
        title="Active Users"
        value={loading ? null : usersStats?.unblockedUsers}
        color="green"
      />
      <StatCard
        icon={UserX}
        title="Blocked Users"
        value={loading ? null : usersStats?.blockedUsers}
        color="red"
      />
    </div>
  );
};

export default UserStats;
