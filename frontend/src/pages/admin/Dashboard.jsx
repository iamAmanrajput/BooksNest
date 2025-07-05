import OverviewStats from "@/components/admin/dashboard/OverviewStats";
import PopularBooks from "@/components/admin/dashboard/PopularBooks";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";
import WelcomeSection from "@/components/admin/dashboard/WelcomeSection";
import React from "react";

const Dashboard = () => {
  return (
    <div className="px-4 pb-6 flex flex-col gap-6 bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <WelcomeSection />
      <OverviewStats />
      <div className=" w-full gap-4 grid grid-cols-1 sm:grid-cols-2">
        <RecentActivity />
        <PopularBooks />
      </div>
    </div>
  );
};

export default Dashboard;
