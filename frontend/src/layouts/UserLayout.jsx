// UserLayout.jsx
import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import UserSidebar from "@/components/user/UserSidebar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/user/Footer";

const UserLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <UserSidebar />

        {/* Content that adjusts automatically */}
        <SidebarInset>
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-full">
              <Navbar />
              {children}
              <Footer />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;
