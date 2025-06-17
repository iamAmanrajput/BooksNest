// UserLayout.jsx
import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import UserSidebar from "@/components/user/UserSidebar";
import Navbar from "@/components/common/Navbar";

const UserLayout = ({ children }) => {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <UserSidebar />

      {/* Content that adjusts automatically */}
      <SidebarInset>
        <main className="flex-1 overflow-auto">
          <Navbar />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UserLayout;
