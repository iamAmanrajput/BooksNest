
import React from "react";
import UserCard from "./UserCard";

const UsersPage = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UserCard />
    </div>
  );
};

export default UsersPage;
