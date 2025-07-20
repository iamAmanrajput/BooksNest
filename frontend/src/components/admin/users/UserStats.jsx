import StatCard from "@/components/common/StatCard";
import { UserCheck, Users, UserX } from "lucide-react";
import React, { useState } from "react";

const UserStats = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      <StatCard
        icon={Users}
        title="Total Users"
        value={loading ? null : 40}
        color="blue"
      />
      <StatCard
        icon={UserCheck}
        title="Active Users"
        value={loading ? null : 30}
        color="green"
      />
      <StatCard
        icon={UserX}
        title="Blocked Users"
        value={loading ? null : 10}
        color="red"
      />
    </div>
  );
};

export default UserStats;
