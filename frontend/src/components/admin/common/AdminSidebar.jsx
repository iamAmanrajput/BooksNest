import {
  BarChart3,
  BookOpen,
  Clock,
  History,
  Home,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

// Menu items
const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Books", url: "/admin/books", icon: BookOpen },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Requests", url: "/admin/requests", icon: Clock },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center gap-3 mt-4 mb-4 pl-4">
        <BookOpen className="text-customblue" />
        <h3
          onClick={() => navigate("/admin/dashboard")}
          className="text-xl font-bold cursor-pointer"
        >
          BooksNest
        </h3>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`${
                    pathname === item.url ? "bg-zinc-200 dark:bg-zinc-600" : ""
                  }`}
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 px-4 py-5"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="border-t border-b text-center p-4">
        <h1 className="font-bold text-lg capitalize">BOOKSNEST ADMIN</h1>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
