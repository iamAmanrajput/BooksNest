// UserLayout.jsx
import React, { useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import UserSidebar from "@/components/user/UserSidebar";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

const UserLayout = ({ children }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6894221cd923c71926e01dc2/1j21aagrt";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
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
