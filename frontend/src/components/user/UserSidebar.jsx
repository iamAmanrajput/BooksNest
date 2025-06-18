import {
  BookOpen,
  CornerDownLeft,
  Heart,
  History,
  Home,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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

// Menu items
const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Browse Books", url: "/books", icon: BookOpen },
  { title: "My History", url: "/history", icon: History },
  { title: "Return Books", url: "/return/book", icon: CornerDownLeft },
  { title: "Whislist", url: "/whislist", icon: Heart },
  { title: "My Profile", url: "/profile", icon: User },
];

const UserSidebar = () => {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center gap-3 mt-4 mb-4 pl-4">
        <BookOpen className="text-customblue" />
        <h3 className="text-xl font-bold">BooksNest</h3>
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
                    <item.icon size={28} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="border-t border-b text-center p-4">
        <h1 className="font-bold text-xl">Aman Kumar</h1>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;
