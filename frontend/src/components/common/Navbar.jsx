import React, { useState } from "react";
import ModeToggle from "./ModeToggle";
import { Bell, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b dark:bg-zinc-900">
      {/* icons */}
      <a to="/" className="text-2xl font-bold">
        Dashboard
      </a>
      <div className="flex gap-6 items-center">
        <ModeToggle></ModeToggle>
        <Bell />
        <LogOut />
      </div>
    </nav>
  );
};

export default Navbar;
