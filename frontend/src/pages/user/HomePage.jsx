import StatCard from "@/components/common/StatCard";
import { AlertTriangle, BookOpen, IndianRupee, RotateCcw } from "lucide-react";
import React from "react";

const HomePage = () => {
  return (
    <div className="px-4 flex flex-col gap-6">
      {/* 1st box */}
      <div className="w-full text-white bg-customblue dark:bg-zinc-900 mt-6 rounded-2xl h-[10rem] flex items-center">
        <div className="flex flex-col gap-3 px-10">
          <h1 className="text-3xl font-bold">Welcome back, John Doe!</h1>
          <p>Discover new books and manage your reading journey.</p>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Active Borrowings"
          value={5}
          color="blue"
          lightColor="blue"
        />
        <StatCard
          icon={RotateCcw}
          title="Returned"
          value={5}
          color="green"
          lightColor="green"
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue"
          value={5}
          color="orange"
          lightColor="orange"
        />

        <StatCard
          icon={IndianRupee}
          title="Total Fines"
          value={5}
          color="red"
          lightColor="red"
        />
      </div>
      <div className="w-full bg-zinc-500">hello</div>
    </div>
  );
};

export default HomePage;
