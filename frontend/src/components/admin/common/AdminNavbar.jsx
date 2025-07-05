import ModeToggle from "@/components/common/ModeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import React from "react";

const AdminNavbar = () => {
  return (
    <nav className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold capitalize text-zinc-800 dark:text-zinc-100 hover:underline">
          Admin Panel
        </h1>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button variant="outline" size="icon">
            <LogOut className="size-4 text-zinc-600 dark:text-zinc-300" />
          </Button>
          <Button variant="outline" size="icon">
            <LogOut className="size-4 text-zinc-600 dark:text-zinc-300" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
