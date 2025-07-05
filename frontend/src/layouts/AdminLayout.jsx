// UserLayout.jsx
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Footer from "@/components/user/Footer";
import AdminNavbar from "@/components/admin/common/AdminNavbar";
import AdminSidebar from "@/components/admin/common/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content that adjusts automatically */}
        <SidebarInset>
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-full">
              <AdminNavbar />
              {children}
              <Footer />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
