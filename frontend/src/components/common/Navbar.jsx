import React from "react";
import { Link } from "react-router-dom";
import ModeToggle from "./ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Bell, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold cursor-pointer">Dashboard</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="icon">
            <Bell className="size-4" />
          </Button>
          <Button variant="outline" size="icon">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
