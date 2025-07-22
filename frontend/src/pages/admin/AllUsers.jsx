import UserFilterPanel from "@/components/admin/users/UserFilterPanel";
import UsersPage from "@/components/admin/users/UsersPage";
import UserStats from "@/components/admin/users/UserStats";
import React from "react";

const AllUsers = () => {
  
  return (
    <div className="px-4 pb-6 flex flex-col gap-6 bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <UserStats />
      <UserFilterPanel />
      <UsersPage />
    </div>
  );
};

export default AllUsers;
