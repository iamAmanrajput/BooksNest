import AnalyticsStats from "@/components/admin/Analytics/AnalyticsStats";
import DashboardInsights from "@/components/admin/Analytics/DashboardInsights";
import DataPeriod from "@/components/admin/Analytics/DataPeriod";
import React from "react";

const Analytics = () => {
  return (
    <div className="px-4 pb-6 flex flex-col gap-6 bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <AnalyticsStats />
      <DataPeriod />
      <DashboardInsights />
    </div>
  );
};

export default Analytics;
